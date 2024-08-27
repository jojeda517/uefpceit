"use client";
import React, { memo } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

const currentYear = new Date().getFullYear();

function Copyright(props) {
  const { href = "https://mui.com/", color = "inherit" } = props;
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color={color} href={href}>
        Unidad Educativa Fiscomisional PCEI Tungurahua
      </Link>{" "}
      {currentYear}
      {"."}
    </Typography>
  );
}

export default memo(Copyright);
