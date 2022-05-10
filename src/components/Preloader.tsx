import styled, { keyframes } from 'styled-components'

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

interface IPreloader {
  size: number,
  marginVertical: number,
}
const Preloader = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 2px solid black;
  background: transparent;
  width: ${(props: IPreloader) => props.size}px;
  height: ${(props: IPreloader) => props.size}px;
  border-radius: 50%;
  margin: ${(props: IPreloader) => props.marginVertical}px auto;
`

export {
  Preloader
}
