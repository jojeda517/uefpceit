import { useState, useEffect } from "react";
import { Alert } from "@material-tailwind/react";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const getAlertStyles = (type) => {
    switch (type) {
      case "success":
        return "border-green-800 bg-green-50 text-green-800";
      case "warning":
        return "border-yellow-800 bg-yellow-50 text-yellow-800";
      case "error":
        return "border-red-800 bg-red-50 text-red-800";
      default:
        return "";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-6 h-6" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-6 h-6" />;
      case "error":
        return <ExclamationCircleIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  if (!message) return null;

  return (
    <Alert
      icon={getIcon(type)}
      className={`fixed bottom-4 left-4 z-50 rounded-none border-l-4 ${getAlertStyles(
        type
      )} font-medium w-auto`}
    >
      {message}
    </Alert>
  );
};

export default Notification;
