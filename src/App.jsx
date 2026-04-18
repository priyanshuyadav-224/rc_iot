import React, { useState, useCallback, useEffect } from 'react'
import WebPSequence from './components/WebPSequence.jsx'
import HUD from './components/HUD.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

/**
 * App — Root component.
 *
 * ANIMATION: Driven by mouse scroll / touch (0→480 frames).
 * DATA: WebP image sequence instead of GLB.
 * REGISTER BUTTON: Appears when scroll reaches the last frame.
 */

function detectMobile() {
  const isNarrow = window.matchMedia('(max-width: 768px)').matches
  const isTouchOnly = window.matchMedia('(pointer: coarse)').matches
  const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  return isNarrow || isTouchOnly || isMobileUA
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(() => detectMobile())

  // Re-detect on resize
  useEffect(() => {
    const handler = () => setIsMobile(detectMobile())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleLoaded = useCallback(() => {
    console.log('[App] All frames ready.')
    setLoaded(true)
  }, [])

  const handleProgress = useCallback((p) => {
    setScrollProgress(p)
  }, [])

  const sequencePath = isMobile ? '/frames/phone/' : '/frames/pc/'

  return (
    <>
      {/* Loading Screen */}
      {!loaded && (
        <LoadingScreen 
          progress={loadProgress} 
          onFinished={() => {}} 
        />
      )}

      {/* Frame Sequence Canvas */}
      <div className="canvas-container">
        <WebPSequence 
          sequencePath={sequencePath}
          onProgress={handleProgress} 
          onLoaded={handleLoaded} 
          onLoadProgress={setLoadProgress}
        />
      </div>

      {/* HUD — shows logo + register button at end */}
      {loaded && <HUD scrollProgress={scrollProgress} />}
    </>
  )
}
