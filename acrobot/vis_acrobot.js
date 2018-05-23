'use strict';
const _ = require('lodash');
const scope = require('yogastudio/scope');

function drawAcrobot(ctx, pt, baseX, baseY, scaleX, scaleY)
{
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX + scaleX * pt.kneePosX, baseY + scaleY * pt.kneePosY);
  ctx.lineTo(baseX + scaleX * pt.tipPosX, baseY + scaleY * pt.tipPosY);
  ctx.lineWidth = 1.25;
  ctx.strokeStyle = '#444444';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(baseX, baseY, 2, 0, 2*Math.PI);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(baseX + scaleX * pt.kneePosX, baseY + scaleY * pt.kneePosY, 2, 0, 2*Math.PI);
  ctx.fillStyle = '#880000';
  ctx.fill();

  const torqueRadius = scaleX*0.1;
  if (pt.waistTorque > 0.05) {
    ctx.beginPath();
    ctx.arc(baseX + scaleX * pt.kneePosX, baseY + scaleY * pt.kneePosY, torqueRadius, +1*pt.th1 - 0.5*Math.PI, +1*(pt.th1+pt.th2) + 0.5*Math.PI, true);
    ctx.strokeStyle = '#880000';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  else if (pt.waistTorque < -0.05) {
    ctx.beginPath();
    ctx.arc(baseX + scaleX * pt.kneePosX, baseY + scaleY * pt.kneePosY, torqueRadius, +1*pt.th1 - 0.5*Math.PI, +1*(pt.th1+pt.th2) + 0.5*Math.PI, false);
    ctx.strokeStyle = '#008800';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }


  ctx.beginPath();
  ctx.arc(baseX + scaleX * pt.tipPosX, baseY + scaleY * pt.tipPosY, 2, 0, 2*Math.PI);
  ctx.fillStyle = '#0000aa';
  ctx.fill();

}

function pathAcrobotSkeleton(ctx, pt, baseX, baseY, scaleX, scaleY)
{
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX + scaleX * pt.kneePosX, baseY + scaleY * pt.kneePosY);
  ctx.lineTo(baseX + scaleX * pt.tipPosX, baseY + scaleY * pt.tipPosY);
}

scope.defScopeTrace('AcrobotPlantState', {

  panels: {
    stick: (m, top, tr) => {
      top.fmtScopePanelCanvas2D(m, tr, (ctx, hd, lo) => {
        let pt = m.getPt(tr, m.visTime);
        if (pt === null || pt === undefined || pt.tipPosY === undefined) return;

        let baseX = lo.boxL + 0.5*lo.boxW;
        let baseY = lo.boxT + 0.5*lo.boxH;
        let scale = Math.min(lo.boxW/1.25, lo.boxH/1.25);
        let scaleX = scale, scaleY = -scale;
        drawAcrobot(ctx, pt, baseX, baseY, scaleX, scaleY);

      });
    }
  },

  defaultScale: 0.7,
  noAutoScale: true,
  drawData: (m, ctx, hd, lo, tr) => {

    let majorInterval = 0.05;

    let baseY = lo.convDataToY(+0.0);
    let scale = Math.abs(lo.convDataToY(+0.0) - lo.convDataToY(-0.75));
    let scaleX = scale, scaleY = -scale;

    m.scan(tr, {
      onBegin: (overlayi, noverlays) => {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = '#eeeeee';
        ctx.globalAlpha = overlayi === noverlays-1 ? 1 : 0.25;
        ctx.beginPath();
      },
      onPt: (time, pt) => {
        pathAcrobotSkeleton(ctx, pt, lo.convTimeToX(time), baseY, scaleX, scaleY);
      },
      onEnd: () => {
        ctx.stroke();
      }});

    // Draw white background for subsampled drawings
    m.scan(tr, {
      onBegin: (_overlayi, _noverlays) => {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
      },
      onMajorPt: (time, pt, _isMajor) => {
        pathAcrobotSkeleton(ctx, pt, lo.convTimeToX(time), baseY, scaleX, scaleY);
      },
      onEnd: () => {
        ctx.stroke();
      },
      majorInterval
    });

    // Draw subsampled drawings
    m.scan(tr, {
      onBegin: (overlayi, noverlays) => {
        ctx.lineWidth = 1.25;
        ctx.strokeStyle = '#444444';
        ctx.globalAlpha = overlayi === noverlays-1 ? 1 : 0.25;
        ctx.beginPath();
      },
      onMajorPt: (time, pt, _isMajor) => {
        pathAcrobotSkeleton(ctx, pt, lo.convTimeToX(time), baseY, scaleX, scaleY);
      },
      onEnd: () => {
        ctx.stroke();
      },
      majorInterval
    });

    // Draw joint dots on subsampled drawings
    m.scan(tr, {
      onBegin: (overlayi, noverlays) => {
        ctx.globalAlpha = overlayi === noverlays-1 ? 1 : 0.25;
        ctx.beginPath();
      },
      onMajorPt: (time, pt, _isMajor) => {
        drawAcrobot(ctx, pt, lo.convTimeToX(time), baseY, scaleX, scaleY);
      },
      onEnd: () => {
      },
      majorInterval
    });
    ctx.globalAlpha = 1;
  }
});


scope.defLiveScriptPanel('run_acrobot', function(m, top, o) {
  top.fmtLiveConfigTabs(m, []);

  let growHandlersBySeqName = {};

  top.expandLiveConfigCells(m, o, growHandlersBySeqName);
  top.handleGrowEvents(m, o, growHandlersBySeqName);
});
