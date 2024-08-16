import React, { memo } from "react";
import { CircularProgress as Circle } from "@nextui-org/react";

const CircularProgress = memo(() => (
  <div className="fixed inset-0 w-full h-full flex justify-center items-center bg-white/10 z-50">
    <Circle
      size="lg"
      color="success"
      label={<span className="text-green-600">Procesando...</span>}
    />
  </div>
));

CircularProgress.displayName = "CircularProgress";

export default CircularProgress;
