"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Input,
  Button,
} from "@nextui-org/react";
import {
  AtSymbolIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function ActualizarDatos() {
  const [isLoading, setIsLoading] = useState(false);
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [foto, setFoto] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisiblePassConfirm, setIsVisiblePassConfirm] = useState(false);
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });

  useEffect(() => {
    // Cargar datos de localStorage al montar el componente
    const storedCorreo = localStorage.getItem("correo");
    const storedCelular = localStorage.getItem("telefono");
    const storedFoto = localStorage.getItem("foto");
    const storedNombre = localStorage.getItem("nombre");
    const storedApellido = localStorage.getItem("apellido");

    setCorreo(storedCorreo || "");
    setCelular(storedCelular || "");
    setFoto(storedFoto || "");
    setNombre(storedNombre || "");
    setApellido(storedApellido || "");
  }, []);

  const validateCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo) ? null : "Correo electrónico inválido.";
  };

  const validateCelular = (celular) => {
    const regex = /^09\d{8}$/;
    return regex.test(celular)
      ? null
      : "El número de celular debe tener 10 dígitos y comenzar con 09.";
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/;
    return regex.test(password)
      ? null
      : "La contraseña debe tener entre 8 y 16 caracteres, incluir al menos una mayúscula, una minúscula, un número y un carácter especial.";
  };

  const handleSubmit = async () => {
    if (!correo || !celular || !password || !confirmPassword) {
      setNotificacion({
        message: "Todos los campos son obligatorios.",
        type: "error",
      });
      return;
    }

    const correoError = validateCorreo(correo);
    const celularError = validateCelular(celular);
    const passwordError = validatePassword(password);

    if (correoError || celularError || passwordError) {
      setNotificacion({
        message: correoError || celularError || passwordError,
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setNotificacion({
        message: "Las contraseñas no coinciden.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const body = {
        correo,
        celular,
        password,
        idPersona: localStorage.getItem("idPersona"),
      };

      const response = await fetch("/api/actualizarDatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificacion({
          message: data.message,
          type: "success",
        });
      } else {
        setNotificacion({
          message: data.message,
          type: "error",
        });
      }
    } catch (error) {
      setNotificacion({
        message: "Error de red o de servidor.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      {isLoading && <CircularProgress />}
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Información del Estudiante
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Actualiza tus datos personales
        </p>
      </div>
      <div className="flex flex-col items-center">
        <Card className="max-w-md w-full shadow-lg dark:bg-gray-700">
          <CardHeader className="flex flex-col items-center text-center py-5">
            <Avatar src={foto} className="w-28 h-28 text-large" />
            <p className="dark:text-white font-bold text-2xl">
              {nombre} {apellido}
            </p>
            <p className="text-base text-blue-900 dark:text-white font-extralight">
              DOCENTE
            </p>
          </CardHeader>
          <CardBody className="px-5">
            <form className="space-y-6">
              {/* Input de correo */}
              <Input
                startContent={
                  <AtSymbolIcon className="text-blue-900 dark:text-black h-5 w-5" />
                }
                label="Correo Electrónico"
                placeholder="Ingresa tu correo"
                value={correo}
                onValueChange={setCorreo}
              />

              {/* Input de teléfono */}
              <Input
                startContent={
                  <PhoneIcon className="text-blue-900 dark:text-black h-5 w-5" />
                }
                label="Número de Celular"
                placeholder="Ingresa tu celular"
                value={celular}
                onValueChange={setCelular}
              />

              {/* Input de nueva contraseña */}
              <Input
                startContent={
                  <LockClosedIcon className="text-blue-900 dark:text-black h-5 w-5" />
                }
                type={isVisiblePass ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisiblePass(!isVisiblePass)}
                    aria-label="toggle password visibility"
                  >
                    {isVisiblePass ? (
                      <EyeSlashIcon className="text-blue-900 dark:text-black h-5 w-5" />
                    ) : (
                      <EyeIcon className="text-blue-900 dark:text-black h-5 w-5" />
                    )}
                  </button>
                }
                label="Nueva Contraseña"
                placeholder="Contraseña"
                value={password}
                onValueChange={setPassword}
              />

              {/* Input de confirmar contraseña */}
              <Input
                startContent={
                  <LockClosedIcon className="text-blue-900 dark:text-black h-5 w-5" />
                }
                type={isVisiblePassConfirm ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() =>
                      setIsVisiblePassConfirm(!isVisiblePassConfirm)
                    }
                    aria-label="toggle password visibility"
                  >
                    {isVisiblePassConfirm ? (
                      <EyeSlashIcon className="text-blue-900 dark:text-black h-5 w-5" />
                    ) : (
                      <EyeIcon className="text-blue-900 dark:text-black h-5 w-5" />
                    )}
                  </button>
                }
                label="Confirmar Nueva Contraseña"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
              />
            </form>
          </CardBody>
          <CardFooter className="flex justify-center py-5">
            <Button
              type="submit"
              onPress={handleSubmit}
              className="bg-gradient-to-tr from-blue-900 to-green-500 text-white"
            >
              Actualizar Datos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ActualizarDatos;
