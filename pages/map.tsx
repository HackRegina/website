import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useRef, useState } from 'react'
import { IMapCompaniesCollection } from '../interfaces/map-companies'

const Map = () => {
  const mapContainer = useRef<any>(null)
  const map = useRef<mapboxgl.Map | any>(null)
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ''

  const [lng, setLng] = useState(-104.618896)
  const [lat, setLat] = useState(50.44521)
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat], // center map on Chad
      zoom: zoom,
    })

    map.current.on('load', async () => {
      const techDataReq = await fetch(
        'https://raw.githubusercontent.com/HackRegina/techmap/master/src/assets/data.json',
        { method: 'GET' },
      )

      const techData: IMapCompaniesCollection = await techDataReq.json()

      techData.forEach((company: any) => {
        const { id, name, website, industry, address, sponsorship, technology } = company
        const latitude = company.lat
        const longitude = company.lng

        const markerIcon = document.createElement('div')
        markerIcon.className = 'location-marker'
        markerIcon.style.backgroundImage = 'url(/location-marker.png)'

        let techStackCollection = document.createElement('div')
        techStackCollection.className = 'tech-stack-collection'

        technology.forEach((techStack: string) => {
          let techStackItem = document.createElement('p')
          techStackItem.className = 'tech-stack-item'
          techStackItem.innerText = techStack
          techStackCollection.appendChild(techStackItem)
        })

        const popUpHTML = `
              <div style="color:black; padding:0.5rem">
                  <h3 style="font-weight:bold">${name}</h3>
                  <hr style="border:0.5px solid black;"/>
                  <p>${address}</p>
                  <a style="color: #007bff" href="${website}">${website}</a>
                  <p style="margin-top:5px; font-weight:bold">Tech:</p>
                  <hr style="border:0.5px solid black;"/>
                  <p>${techStackCollection.outerHTML}</p>
              </div>
              `
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popUpHTML))
          .addTo(map.current)
      })
    })
  }, [])

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default Map
