import test from 'ava'
import {CSG, CAG} from '../csg'

//
// Test suite for CSG initialization (new)
// - verify that the CSG is "empty" in all ways
// - verify that CSG functions do / return nothing
// - verify that the CSG converts to/from properly
//
test('New CSG should contain nothing', t => {
  let csg = new CSG()

// conversion functions
  t.is(csg.toString(), 'CSG solid:\n')

  t.true(Array.isArray(csg.toPolygons()))
  t.is(csg.toPolygons().length, 0)

  let feature = csg.getFeatures('volume')
  t.is(feature, 0)
  let feature2 = csg.getFeatures('area')
  t.is(feature2, 0)

  let bounds = csg.getBounds()
  t.true(Array.isArray(bounds))
  t.is(bounds.length, 2)
  t.is(typeof bounds[0], 'object')
  t.is(typeof bounds[1], 'object')

  let vector0 = bounds[0]
  t.is(typeof vector0, 'object')
  t.is(vector0.x, 0)
  t.is(vector0.y, 0)
  t.is(vector0.z, 0)
  let vector1 = bounds[1]
  t.is(typeof vector1, 'object')
  t.is(vector1.x, 0)
  t.is(vector1.y, 0)
  t.is(vector1.z, 0)

  let triangles = csg.toTriangles()
  t.is(triangles.length, 0)

  let binary = csg.toCompactBinary()
  t.is(binary.class, 'CSG')
  t.is(binary.numPolygons, 0)
  t.is(binary.numVerticesPerPolygon.length, 0)
  t.is(binary.polygonPlaneIndexes.length, 0)
  t.is(binary.polygonSharedIndexes.length, 0)
  t.is(binary.polygonVertices.length, 0)
})

test('New CSG should do nothing', t => {
  let csg = new CSG()

// tests for basic transforms
  let shared = new CSG.Polygon.Shared([0.1, 0.2, 0.3, 0.4])
  let acsg = csg.setShared(shared)
  t.deepEqual(csg, acsg)

  acsg = csg.setColor(0.1, 0.2, 0.3, 0.4)
  t.deepEqual(csg, acsg)

  acsg = csg.canonicalized()
  t.deepEqual(csg, acsg)

  acsg = csg.reTesselated()
  t.deepEqual(csg, acsg)

  let matrix = CSG.Matrix4x4.rotationX(45)
  acsg = csg.transform1(matrix)
  // FIXME
  //  -  "isCanonicalized": true
  //  +  "isCanonicalized": false
  // t.deepEqual(csg,acsg);

  acsg = csg.transform(matrix)
  t.deepEqual(csg, acsg)

  acsg = csg.fixTJunctions(matrix)
  t.deepEqual(csg, acsg)

// tests for common transforms
  let plane = new CSG.Plane(CSG.Vector3D.Create(0, 0, 1), 0)
  acsg = csg.mirrored(plane)
  t.deepEqual(csg, acsg)
  acsg = csg.mirroredX()
  t.deepEqual(csg, acsg)
  acsg = csg.mirroredY()
  t.deepEqual(csg, acsg)
  acsg = csg.mirroredZ()
  t.deepEqual(csg, acsg)

  acsg = csg.translate([10, 10, 10])
  t.deepEqual(csg, acsg)

  acsg = csg.scale([2.0, 2.0, 2.0])
  t.deepEqual(csg, acsg)

  acsg = csg.rotate([0, 0, 0], [1, 1, 1], 45)
  t.deepEqual(csg, acsg)
  acsg = csg.rotateX()
  t.deepEqual(csg, acsg)
  acsg = csg.rotateY()
  t.deepEqual(csg, acsg)
  acsg = csg.rotateZ()
  t.deepEqual(csg, acsg)
  acsg = csg.rotateEulerAngles(45, 45, 45, [0, 0, 0])
  t.deepEqual(csg, acsg)

  // FIXME
  acsg = csg.center([true, true, true])
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

// TODO write tests for enhanced transforms
  // FIXME
  acsg = csg.cutByPlane(plane)
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  acsg = csg.expand(2.0, 36)
  // FXIME caching of boundingBox changes original object
  delete(csg.cachedBoundingBox) // FIXME: HACK !!
  t.deepEqual(csg, acsg)

  // FIXME
  acsg = csg.contract(2.0, 36)
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.invert()
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.stretchAtPlane([1, 0, 0], [0, 0, 0], 2.0)
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.expandedShell(2.0, 36, false)
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.lieFlat()
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);
})

test('New CSG should return empty values', t => {
  let csg = new CSG()

  let imatrix = new CSG.Matrix4x4()
  let aarray = csg.getTransformationAndInverseTransformationToFlatLying()
  t.is(aarray.length, 2)
  t.deepEqual(aarray[0], imatrix)
  t.deepEqual(aarray[1], imatrix)

  let amatrix = csg.getTransformationToFlatLying()
  t.deepEqual(amatrix, imatrix)

  let plane = new CSG.Plane(CSG.Vector3D.Create(0, 0, 1), 0)
  let onb = new CSG.OrthoNormalBasis(plane)

  let cag = new CAG()
  let ucag = cag.union(new CAG())

  let acag = csg.projectToOrthoNormalBasis(onb)
  // NOTE: CAG.union() is being called internally so compare accordingly
  t.deepEqual(acag, ucag)

  acag = csg.sectionCut(onb)
  // NOTE: CAG.union() is being called internally so compare accordingly
  t.deepEqual(acag, ucag)

  let acsg = CSG.toPointCloud(csg)
  t.deepEqual(acsg, csg)
})

test('New CSG should convert properly', t => {
  let csg = new CSG()

  let acb = csg.toCompactBinary()
  let acsg = CSG.fromCompactBinary(acb)
  t.deepEqual(csg, acsg)

    // TODO use toObject() when available
  let aobj = {polygons: [], isCanonicalized: true, isRetesselated: true}
  acsg = CSG.fromObject(aobj)
  t.deepEqual(acsg, csg)

  let polygons = csg.toTriangles()
  t.is(polygons.length, 0)
  acsg = CSG.fromPolygons(polygons)
  t.deepEqual(acsg.polygons, polygons)
  t.deepEqual(acsg.isCanonicalized, false)
  t.deepEqual(acsg.isRetesselated, false)
})
