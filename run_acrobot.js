/*

*/
'use strict';
console._stdout = process.stderr;  // so we can use ParentPipe
const _ = require('lodash');
const async = require('async');
const logio = require('tlbcore/common/logio');
const ys = require('yogastudio');
const yb = require('yogastudio/binary'); // The program compiled in the current directory

function main()
{
  ys.runSession(process.argv, {
    tracePrefix: 'run_acrobot',
    robotName: 'acrobot',
    duration: 20.0,
  }, [
    function setupFwd(cb) {
      this.tr.traceNotes.preferScrollCursor = true;
      this.addSeq('plantState', 'AcrobotPlantState', {});
      this.addSeq('agentState', 'AcrobotAgentState', {});
      this.addSeq('plantSense', 'AcrobotSense');
      this.addSeq('plantCmd', 'AcrobotCmd', {});
      this.addSeq('agentAstonishment', 'double');
      cb(null);
    },
    function setupPlant(cb) {
      this.addEngine('plant', new yb.AcrobotPlantEngine({
        cmdIn: this.seqs.plantCmd,
        sUpdate: this.seqs.plantState,
        senseOut: this.seqs.plantSense,
        debugOut: this.addSeq('plantDebug', 'AcrobotPlantEngineDebug'),
        cIn: this.addParams('plantConfig', 'AcrobotPlantConfig', 'acrobot_plant'),
      }));
      //this.engines.plant.verbose = 2;
      cb(null);
    },
    function setupAgent(cb) {
      this.addEngine('agent', new yb.AcrobotAgentEngine({
        cmdOut: this.seqs.plantCmd,
        sUpdate: this.seqs.agentState,
        senseIn: this.seqs.plantSense,
        debugOut: this.addSeq('agentDebug', 'AcrobotAgentEngineDebug'),
        cIn: this.addParams('agentConfig', 'AcrobotAgentConfig', 'acrobot_agent'),
        astonishmentOut: this.seqs.agentAstonishment,
      }));
      //this.engines.agent.verbose = 2;
      cb(null);
    },

  ]);
}

if (require.main === module) main();
