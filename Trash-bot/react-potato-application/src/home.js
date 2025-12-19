import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import logo from "./logo.jpg";
import image from "./bg.jpg";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";
import axios from "axios";


const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/predict";

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "100%",
    borderRadius: "12px",
    padding: "16px 32px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textTransform: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
    "&:hover": {
      background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.45)",
      transform: "translateY(-2px)",
    },
  },
  root: { maxWidth: 700, flexGrow: 1 },
  media: { 
    height: 520,
    objectFit: "cover",
    width: "100%",
    display: "block",
  },
  paper: { padding: theme.spacing(2), margin: "auto", maxWidth: 500 },
  gridContainer: { 
    justifyContent: "center", 
    padding: "60px 24px 40px 24px",
    minHeight: "calc(100vh - 64px)",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  mainContainer: {
    background: "#ffffff",
    minHeight: "calc(100vh - 64px)",
    marginTop: "0px",
    position: "relative",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 800,
    width: "100%",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06) !important",
    borderRadius: "24px",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    border: "1px solid rgba(0, 0, 0, 0.06)",
  },
  imageCardEmpty: { 
    height: "auto",
    minHeight: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
  },
  input: { display: "none" },
  tableContainer: { 
    backgroundColor: "transparent !important", 
    boxShadow: "none !important",
    width: "100%",
  },
  table: { backgroundColor: "transparent !important" },
  tableHead: { backgroundColor: "transparent !important" },
  tableRow: { backgroundColor: "transparent !important" },
  tableCell: {
    fontSize: "24px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#ffffff !important",
    fontWeight: 700,
    padding: "12px 24px",
    fontFamily: "'Inter', sans-serif",
  },
  tableCell1: {
    fontSize: "12px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "rgba(255, 255, 255, 0.8) !important",
    fontWeight: 600,
    padding: "8px 24px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontFamily: "'Inter', sans-serif",
  },
  tableBody: { backgroundColor: "transparent !important" },
  text: { color: "white !important", textAlign: "center" },
  buttonGrid: { maxWidth: "800px", width: "100%", marginTop: "24px" },
  detail: { 
    background: "#ffffff",
    display: "flex", 
    justifyContent: "center", 
    flexDirection: "column", 
    alignItems: "center",
    padding: "40px 32px",
  },
  appbar: { 
    background: "#ffffff !important",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08) !important",
    color: "#1a202c",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  },
  loader: { 
    color: "#667eea !important",
    marginBottom: "20px",
  },
  title: {
    fontWeight: 700,
    fontSize: "18px",
    letterSpacing: "-0.2px",
    fontFamily: "'Inter', sans-serif",
    color: "#0f172a",
  },
  processingText: {
    color: "#64748b",
    fontWeight: 500,
    marginTop: "20px",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
  },
  resultContainer: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    padding: "32px 28px",
    marginBottom: "0px",
    boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)",
  },
  resultTitle: {
    color: "#ffffff",
    fontWeight: 700,
    marginBottom: "24px",
    textAlign: "center",
    fontSize: "16px",
    letterSpacing: "0.2px",
    fontFamily: "'Inter', sans-serif",
  },
  resultLabel: {
    color: "rgba(255, 255, 255, 0.8) !important",
  },
  resultValue: {
    color: "#ffffff !important",
    fontSize: "26px !important",
  },
  heroText: {
    textAlign: "center",
    marginBottom: "40px",
    maxWidth: "700px",
    margin: "0 auto 40px auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: "1.2",
    marginBottom: "20px",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-1px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "36px",
    },
  },
  heroHighlight: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroDescription: {
    fontSize: "18px",
    color: "#64748b",
    lineHeight: "1.6",
    fontWeight: 400,
    fontFamily: "'Inter', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    [theme.breakpoints.down('sm')]: {
      fontSize: "16px",
      padding: "0 16px",
    },
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending file to backend
  const sendFile = async () => {
    if (!imageLoaded || !selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post(REACT_APP_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearData = () => {
    setData(null);
    setImageLoaded(false);
    setSelectedFile(null);
    setPreview(null);
  };

  // Preview selected file
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  // Send file when preview changes
  useEffect(() => {
    if (!preview) return;
    let isMounted = true;
    setIsLoading(true);

    const send = async () => {
      await sendFile();
      if (isMounted) setIsLoading(false);
    };

    send();
    return () => { isMounted = false };
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImageLoaded(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImageLoaded(true);
  };

  const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar style={{ padding: "14px 40px", minHeight: "64px" }}>
          <Typography variant="h6" noWrap className={classes.title}>
            🗑️ Trash Classification AI
          </Typography>
          <div className={classes.grow} />
          <Avatar src={logo} style={{ border: "2px solid rgba(0, 0, 0, 0.06)", width: "36px", height: "36px" }}></Avatar>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters>
        <Grid className={classes.gridContainer} container spacing={2}>
          {!imageLoaded && !data && !isLoading && (
            <Grid item xs={12}>
              <div className={classes.heroText}>
                <Typography variant="h1" className={classes.heroTitle}>
                  Classify <span className={classes.heroHighlight}>trash</span> images instantly
                </Typography>
                <Typography variant="body1" className={classes.heroDescription}>
                  Upload images to automatically classify waste into categories: <strong>E-waste</strong>, <strong>Paper</strong>, <strong>Plastic</strong>, and <strong>Food</strong>. 
                  No technical skills needed—just upload, analyze, and get instant results!
                </Typography>
              </div>
            </Grid>
          )}
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!imageLoaded ? classes.imageCardEmpty : ""}`}>
              {imageLoaded && preview && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    title="Uploaded Image"
                  />
                </CardActionArea>
              )}

              {!imageLoaded && (
                <CardContent style={{ padding: "0" }}>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText="Drag and drop a trash image here or click to browse"
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {data && (
                <CardContent className={classes.detail}>
                  <div className={classes.resultContainer}>
                    <Typography variant="h6" className={classes.resultTitle}>
                      Classification Result
                    </Typography>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table size="small" aria-label="simple table" className={classes.table}>
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={`${classes.tableCell1} ${classes.resultLabel}`}>Category</TableCell>
                            <TableCell align="right" className={`${classes.tableCell1} ${classes.resultLabel}`}>Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={`${classes.tableCell} ${classes.resultValue}`}>{data.class}</TableCell>
                            <TableCell align="right" className={`${classes.tableCell} ${classes.resultValue}`}>{confidence}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </CardContent>
              )}

              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} size={60} thickness={4} />
                  <Typography variant="h6" className={classes.processingText}>
                    Analyzing trash image...
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {data && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
                size="large"
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
