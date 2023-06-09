import React,{useEffect, useContext, useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import {Download} from './EditScreenComponents';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';


export default function ViewScreen() {
  
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const loggedInUser = auth.user?auth.user.username:"";
  const mapId = store.mapId;
  const mapData = require('../test/MapEditingInfo.json');
  const usData = require('../test/us.json');
  const [comment, setComment] = useState('');
  const [feedComments, setFeedComments] = useState([]);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const countryStyle = {
    fillColor: 'yellow',
    color: 'black',
    weight: 1,
    height: '100%',
  };

  useEffect(()=>{
    console.log(store.commentListPairs)
    setFeedComments(store.commentListPairs)
  },[store]);
  console.log(store.commentListPairs);

  const handleComment = (e) => {
    const copyFeedComments = [...feedComments];
    copyFeedComments.push({ user:loggedInUser, comment: comment});
    setFeedComments(copyFeedComments);
    setComment('');
    store.updateComment(mapId, copyFeedComments);
  };
  
  const CommentList = props => {
    return (
      <div className="userCommentBox"
      style = {{fontSize:"12pt", width:"100%", height:50}}
      >
        <p className="userName">{props.userName}</p>
        <div className="userComment"
        style = {{fontSize:"10pt", width:"100%", height:100}}
        >{props.userComment}</div>  
      </div>
    );
  };

  function handleFork(){
    store.forkMap(mapId);
  }

  return (
    <div>
      <Download setOpen={setDownloadOpen} open={downloadOpen}/>
      <div>

        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': {
              m: 1,
              width: '85vw',
              background: 'white',
            },
          }}
          noValidate
          autoComplete="off"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <div style={{width:"80%", left:"2%", fontSize:"20pt"}}> {store.mapName}</div>
            <Button
              onClick={()=>{handleFork()}}
              variant="contained"
              href="#"
              sx={{
                'align-self': 'center',
              }}
            >
              Fork
            </Button>
            <Button
              variant="contained"
              href="#"
              sx={{ 'align-self': 'center' }}
              onClick={()=>{setDownloadOpen(true)}}
            >
              Download
            </Button>
          </Stack>
        </Box>
      </div>
      <div style={{ height: '80vh' }}>
        <Stack direction="row" height="100%">
          <div
            style={{
              width: '70%',
              background: 'gray',
              height: '100%',
            }}
          >
            <MapContainer
              style={{ height: '80vh' }}
              center={[42.09618442380296, -71.5045166015625]}
              zoom={7}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
              />
              <GeoJSON 
                data={store.geojson || usData || mapData.geojson}
                style={countryStyle}
              />
            </MapContainer>
          </div>
          <div style={{ width: '30%', background: 'black', height: '100%'}}>
          <Stack
            direction="column"
            height="100%"
            justifyContent="space-between"
          >
            <div style={{background: 'white', overflowY: 'scroll', scrollBehavior: 'smooth', height: '100%'}}>
            {feedComments.map((commentArr, i) => {
              //{console.log(commentArr)}
              return(
                <CommentList
                  userName={commentArr["user"]}
                  userComment={commentArr["comment"]}
                  key={i}
                />
              );
            })}
            
            </div>
          <div style={{ background: 'rgb(192,192,192)'}}>
            <TextField
              style={{width:"80%"}}
              id="comment"
              name="comment"
              label="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained" href="#" 
              sx={{ 'align-self': 'center' }} 
              style={{maxWidth:"20%", transform: "translateY(25%)"}}
              onClick={handleComment}
              disabled={comment.length > 0  ? false : true}
              >
               Comment
              
            </Button>
            {console.log(store.commentListPairs)}
          </div>
        </Stack>
          </div>
        </Stack>
      </div>
      <div>
        
      </div>
    </div>
  );
}
