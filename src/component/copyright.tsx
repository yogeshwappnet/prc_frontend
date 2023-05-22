import { Link, Typography } from "@mui/material";

const CopyRight: React.FC = () => {
  return (
    <>
      <Typography variant="body2" color="text.secondary" align="center">
        v0.0.3
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://pebbleridgecap.com/">
          Pebble Ridge Capital
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
};

export default CopyRight;
