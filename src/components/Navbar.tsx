import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

interface NavbarProps {
  handlePrint: () => void;
}

function Navbar(props: NavbarProps) {
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
            <Box sx={{ flexGrow: 1 }}>
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
