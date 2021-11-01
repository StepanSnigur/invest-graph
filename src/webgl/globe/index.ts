import {
  Color,
  MeshPhongMaterial,
} from 'three'

export const getGlobeMaterial = () =>{
  const globeMaterial = new MeshPhongMaterial()
  globeMaterial.color = new Color(0x3a228a)
  globeMaterial.emissive = new Color(0x220038)
  globeMaterial.emissiveIntensity = 0.1
  globeMaterial.shininess = 0.7
  return globeMaterial
}
