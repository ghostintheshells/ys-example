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
    tracePrefix: 'run_segwell',
    robotName: 'segwell',
    duration: 20.0,
  }, [
    function setupFwd(cb) {
      this.tr.traceNotes.preferScrollCursor = true;
      this.addSeq('mechState', 'SegwellMechState', {});
      this.addSeq('balanceState', 'SegwellBalanceState', {});
      this.addSeq('balanceOut', 'SegwellBalanceOut', {});
      this.addSeq('riderOut', 'SegwellRiderOut', {});
      cb(null);
    },
    function setupMech(cb) {
      this.addEngine('mech', new yb.SegwellMechEngine({
        balanceOutIn: this.seqs.balanceOut,
        riderOutIn: this.seqs.riderOut,
        sUpdate: this.seqs.mechState,
        debugOut: this.addSeq('mechDebug', 'SegwellMechEngineDebug'),
        cIn: this.addParams('mechConfig', 'SegwellMechConfig', 'segwellMechConfig'),
        astonishmentOut: this.addSeq('mechAstonishment', 'double'),
      }));
      //this.engines.plant.verbose = 2;
      cb(null);
    },
    function setupBalance(cb) {
      this.addEngine('balance', new yb.SegwellBalanceEngine({
        oOut: this.seqs.balanceOut,
        sUpdate: this.seqs.balanceState,
        mechIn: this.seqs.mechState,
        mechConfigIn: this.seqs.mechConfig,
        debugOut: this.addSeq('balanceDebug', 'SegwellBalanceEngineDebug'),
        cIn: this.addParams('balanceConfig', 'SegwellBalanceConfig', 'segwellBalanceConfig'),
        astonishmentOut: this.addSeq('balanceAstonishment', 'double'),
      }));
      //this.engines.plant.verbose = 2;
      cb(null);
    },
    function setupRider(cb) {
      this.addEngine('rider', new yb.SegwellRiderEngine({
        oOut: this.seqs.riderOut,
        //sUpdate: this.seqs.riderState,
        mechIn: this.seqs.mechState,
        mechConfigIn: this.seqs.mechConfig,
        debugOut: this.addSeq('riderDebug', 'SegwellRiderEngineDebug'),
        cIn: this.addParams('riderConfig', 'SegwellRiderConfig', 'segwellRiderConfig'),
        astonishmentOut: this.addSeq('riderAstonishment', 'double'),
      }));
      //this.engines.plant.verbose = 2;
      cb(null);
    },

  ]);
}

if (require.main === module) main();
