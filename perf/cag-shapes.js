import test from 'ava'
import {CSG, CAG} from '../csg'

let Benchmark = require('benchmark')


function suiteStart(event) {
  let suite = event.currentTarget
  //console.log(suite)
  console.log('***** '+suite.name+' Start: '+event.timeStamp)
}

function suiteComplete(event) {
  let suite = event.currentTarget
  console.log('***** '+suite.name+' Complete: '+event.timeStamp)
  //console.log(event)
}

// called in between benchmarks
function suiteCycle(event) {
  //console.log(event.target);
}

function benchmarkStart(event) {
  console.log('  Benchmark Start: '+event.target.options.name);
}

function benchmarkComplete(event) {
  console.log('  Benchmark Complete: '+event.target.options.name);
  console.log('    Mean: '+event.target.stats.mean.toFixed(6))
  console.log('    Deviation: '+event.target.stats.deviation.toFixed(6))
  console.log('    Variance: '+event.target.stats.variance.toFixed(6))
  console.log('    Elasped: '+event.target.times.elapsed.toFixed(6))
// TODO
  // store the results for comparison
}

//
//
test('CSG.cube() performance should not deviate', t => {
  function createCube() {
    let o = CSG.cube({center: [5, 5, 5], radius: 10})
  }

  let suite = new Benchmark.Suite(
    'CSG Cube Benchmark',
    {
      'onStart'    : suiteStart,
      'onComplete' : suiteComplete,
      'onCycle'    : suiteCycle,
    }
  )

  suite.add({
    'name' : 'CSG.cube()',
    'onStart'   : benchmarkStart,
    'onComplete': benchmarkComplete,
    'fn'        : createCube,
    'minSamples': 100,
  })

  suite.run({ 'async': false })

// TODO verify benchmark aligns with historical recordings
  t.is(true,true)
})

