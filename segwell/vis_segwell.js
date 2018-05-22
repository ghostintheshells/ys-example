'use strict';
const _ = require('lodash');
const scope = require('yogastudio/scope');


scope.defLiveScriptPanel('run_segwell', function(m, top, o) {
  top.fmtLiveConfigTabs(m, []);

  let growHandlersBySeqName = {};

  top.expandLiveConfigCells(m, o, growHandlersBySeqName);
  top.handleGrowEvents(m, o, growHandlersBySeqName);
});


scope.defScopeTrace('SegwellMechState', {

  panels: {
    stick: (m, top, tr) => {
      top.fmtScopePanelCanvas2D(m, tr, (ctx, hd, lo) => {
        let pt = m.getPt(tr, m.visTime);
        if (pt === null || pt === undefined || pt.basePosX === undefined || pt.basePosY === 0) return;

        let cTr = {seqName: 'mechConfig', fullName: 'mechConfig'};
        let cPt = m.getPt(cTr, m.visTime);

        lo.orgX = lo.boxL + 0.5*lo.boxW;
        lo.orgY = lo.boxT + 0.85*lo.boxH;
        let scale = Math.min(lo.boxW/1.2, lo.boxH/3.0);
        lo.scaleX = scale;
        lo.scaleY = -scale;

        lo.convSegXToX = (x) => {
          return (x-pt.basePosX)*lo.scaleX + lo.orgX;
        };
        lo.convSegYToY = (y) => {
          return y * lo.scaleY + lo.orgY;
        };

        drawSegwell(ctx, lo, pt, cPt);

      });
    }
  },
});


function drawSegwell(ctx, lo, pt, cPt)
{

  let bX = lo.convSegXToX(pt.basePosX);
  let bY = lo.convSegYToY(pt.basePosY);

  if (1) { // rider body
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(lo.convSegXToX(pt.riderPosX), lo.convSegYToY(pt.riderPosY));
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#999999';
    ctx.stroke();
  }

  if (1) { // handle
    ctx.beginPath();
    ctx.moveTo(bX, bY);
    ctx.lineTo(lo.convSegXToX(pt.handlePosX), lo.convSegYToY(pt.handlePosY));
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#999999';
    ctx.stroke();
  }

  if (1) { // wheel
    ctx.beginPath();
    ctx.ellipse(bX, bY,
      Math.abs(cPt.wheelRad * lo.scaleX),
      Math.abs(cPt.wheelRad * lo.scaleY),
      0,
      0, 2*Math.PI, false);
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = '#eeeeee';
    ctx.fill();

    ctx.beginPath();
    let wheelAngle = pt.basePosX / -cPt.wheelRad;
    let nspokes = 4;
    let spokeLen = cPt.wheelRad * 0.99;
    for (let spokei=0; spokei < nspokes; spokei++) {
      let spokeAngle = wheelAngle + spokei/nspokes*2*Math.PI;
      ctx.moveTo(lo.convSegXToX(pt.basePosX), lo.convSegYToY(pt.basePosY));
      ctx.lineTo(
        lo.convSegXToX(pt.basePosX + Math.cos(spokeAngle) * spokeLen),
        lo.convSegYToY(pt.basePosY + Math.sin(spokeAngle) * spokeLen));
    }
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  if (1) { // rider head
    ctx.beginPath();
    ctx.ellipse(lo.convSegXToX(pt.riderPosX), lo.convSegYToY(pt.riderPosY),
      Math.abs(0.1 * lo.scaleX),
      Math.abs(0.1 * lo.scaleY),
      0,
      0, 2*Math.PI, false);
    ctx.strokeStyle = '#cc9999';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#ffeeee';
    ctx.fill();
  }

  if (1) { // floor
    let floorTile = 1.0;
    let ftiLo = Math.floor(pt.basePosX / floorTile) - 2;
    let ftiHi = Math.ceil(pt.basePosX / floorTile) + 2;
    for (let fti = ftiLo;  fti <= ftiHi; fti++) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        lo.convSegXToX(fti * floorTile),
        lo.convSegYToY(pt.groundPosY),
        lo.convSegXToX((fti+0.5) * floorTile) - lo.convSegXToX(fti * floorTile),
        lo.convSegYToY(pt.groundPosY - 0.1) - lo.convSegYToY(-0));
    }
  }

  if (1) { // body vel

  }


}
