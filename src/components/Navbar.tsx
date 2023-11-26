import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import React from "react";

interface NavbarProps {
  handlePrint: () => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

function Navbar(props: NavbarProps) {
  const [width, setWidth] = React.useState<number>(224);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      props.setTitle("Untitled Document");
    }
    props.setTitle(e.target.value);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      props.setTitle("Untitled Document");
    }
  };

  React.useEffect(() => {
    // if (props.title.length === 0) {
    //   setWidth(224);
    // }
    setWidth(16 + props.title.length * 11.5);
  }, [props.title, width]);
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "white",
          height: "6vh",
          boxShadow: "none",
          display: {
            xs: "flex",
            justifyContent: "center",
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                DOCS
              </Typography>
              <input
                value={props.title}
                onChange={(e) => handleTitleChange(e)}
                onBlur={(e) => handleTitleBlur(e)}
                style={{
                  border: "none",
                  fontSize: "1.5rem",
                  minWidth: "14px",
                  width: `${width}px`,
                  maxWidth: "1150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              ></input>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button variant="contained" onClick={props.handlePrint}>
                Export as PDF
              </Button>
            </Box>
          </Toolbar>
          {/* <Button>Export as PDF</Button> */}
        </Container>
      </AppBar>
    </>
  );
}
export default Navbar;
