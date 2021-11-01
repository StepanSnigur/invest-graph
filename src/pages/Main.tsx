import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Header } from '../components/Header'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { getGlobeMaterial } from '../webgl/globe'
import countries from '../webgl/globe/data/globe-data-min.json'
import indexesHistory from '../webgl/globe/data/indexes-data.json'

const ContentWrapper = styled.div`
  width: 1280px;
  margin: 0 auto;
`
const GlobeWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  padding-top: 100px;
`
const GlobeShadowContainer = styled.div`
  position: relative;
  z-index: 0;
`
const GlobeShadow = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 145%;
  height: 145%;
  border: 200px solid #1a1a24;
  border-radius: 50%;
  z-index: 0;
  filter: blur(20px);
`
const HeaderWrapper = styled.div`
  position: relative;
  z-index: 1;
`
const MainHeadline = styled.h2`
  color: #fff;
  font-family: Montserrat, sans-serif;
  z-index: 1;
`

export const Main = () => {
  const globeRef = useRef<GlobeMethods | undefined>()

  // set default camera and controls settings
  useEffect(() => {
    if (globeRef.current) {
      const camera = globeRef.current?.camera()
      camera.position.z = 240

      const controls = globeRef.current?.controls()
      // @ts-ignore
      controls.enableZoom = false
    }
  }, [globeRef])

  return (
    <ContentWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <GlobeWrapper>
        <MainHeadline>
          Расчерчивайте графики, следите за последними новостями и принимайте более обдуманные решения.
        </MainHeadline>
        <GlobeShadowContainer>
          <GlobeShadow />
          <Globe
            ref={globeRef}
            width={640}
            height={640}
            backgroundColor="#1a1a24"
            showAtmosphere={false}

            hexPolygonsData={countries.features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.7}
            hexPolygonColor={(e: any) => {
              if (["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
                e.properties.ISO_A3
              )
              ) {
                return 'rgba(255,255,255, 0.5)'
              } else {
                return 'rgba(255,255,255, 0.7)'
              }
            }}

            labelAltitude={0.01}
            labelResolution={10}
            labelText={(e: any) => `${e.name}\n${e.price}`}
            labelSize={(e: any) => e.size}
            labelDotRadius={0.5}
            labelDotOrientation={(e: any) => e.text === 'ALA' ? 'top' : 'right'}
            labelColor={(e: any) => e.price[0] === '-' ? '#f44336' : '#009688'}
            labelsData={indexesHistory.indexes}
            onLabelHover={(label, prevLabel) => {
              console.log(label, prevLabel)
            }}

            globeMaterial={getGlobeMaterial()}
          />
        </GlobeShadowContainer>
      </GlobeWrapper>
    </ContentWrapper>
  )
}
