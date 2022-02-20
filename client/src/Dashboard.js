import React, { useState, useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node';
import Track from './Track';
import Player from './Player';

const spotifyApi = new SpotifyWebApi({
    clientId: '7ee6e0d5591a43529a41c604207bde27',
})

export default function Dashboard({code}) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults)
  const [playingTrack, setPlayingTrack] = useState()

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch('')
  }

  useEffect(() => {
    if(!accessToken) return 
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if(!search) return setSearchResults([])
    if(!accessToken) return

    let cancel = false;

    spotifyApi.searchTracks(search).then(res => {
      
      if (cancel) return
      setSearchResults(res.body.tracks.items.map(track => {

        const smallestAlbumCover = track.album.images.reduce((smallest,image)=>{
          if (image.height < smallest.height){
            return image
          }
          return smallest
        }, track.album.images[0])

        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumCover.url         
        }
      }))
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' style={{minHeight: '100vh'}}>
        <Form.Control 
            type='search' 
            placeholder='Search'
            value={search} 
            onChange={e => setSearch(e.target.value)}
        />
       <div className='flex-grow-1 my-2' style={{overflowY: 'auto'}}>
            {searchResults.map(track => (
                <Track track={track} key={track.uri} chooseTrack={chooseTrack}/>
            ))}
        </div>
        <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
    </Container>

  )
}
