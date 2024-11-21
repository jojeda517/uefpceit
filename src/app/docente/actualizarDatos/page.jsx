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
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
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
    // Cargar datos de localStorage cuando el componente se monta
    const storedCorreo = localStorage.getItem("correo");
    const storedCelular = localStorage.getItem("telefono");
    const storedFoto = localStorage.getItem("foto");
    const storedNombre = localStorage.getItem("nombre");
    const storedApellido = localStorage.getItem("apellido");

    setCorreo(storedCorreo || ""); // Asigna el valor de localStorage o vacío si es null
    setCelular(storedCelular || "");
    setFoto(storedFoto || "");
    setNombre(storedNombre || "");
    setApellido(storedApellido || "");
  }, []); // Solo se ejecuta una vez al montar

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (password !== confirmPassword) {
        setNotificacion({
          message: "Las contraseñas no coinciden",
          type: "error",
        });
        return;
      }

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
        message: "Error de red o de servidor",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibilityPass = () => setIsVisiblePass(!isVisiblePass);
  const toggleVisibilityPassConfirm = () =>
    setIsVisiblePassConfirm(!isVisiblePassConfirm);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      {isLoading && <CircularProgress />}
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Información del Estudiante
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Actualiza tus datos personales
          </p>
        </div>
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
              <div>
                <div align="center" className="space-x-2">
                  <Input
                    startContent={
                      <AtSymbolIcon className="text-blue-900 dark:text-black h-5 w-5 " />
                    }
                    label={
                      <label className="text-blue-900 dark:text-black">
                        Correo Electrónico
                      </label>
                    }
                    vaariant="bordered"
                    clearable
                    fullWidth
                    placeholder="Ingresa tu correo"
                    value={correo}
                    onValueChange={setCorreo}
                    classNames={{
                      base: "",
                      input: "text-gray-900 dark:text-black",
                      inputWrapper:
                        "dark:bg-gray-100 dark:hover:bg-gray-100 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                    }}
                  />
                </div>
              </div>
              <div>
                <div align="center" className="space-x-2">
                  <Input
                    startContent={
                      <PhoneIcon className="text-blue-900 dark:text-black h-5 w-5 " />
                    }
                    clearable
                    fullWidth
                    label="Número de Celular"
                    placeholder="Ingresa tu celular"
                    value={celular}
                    onValueChange={setCelular}
                    classNames={{
                      base: "",
                      input: "text-gray-900 dark:text-black",
                      inputWrapper:
                        "dark:bg-gray-100 dark:hover:bg-gray-100 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                    }}
                  />
                </div>
              </div>
              <div>
                <div align="center" className="space-x-2">
                  <Input
                    startContent={
                      <LockClosedIcon className="text-blue-900 dark:text-black h-5 w-5 " />
                    }
                    type={isVisiblePass ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityPass}
                        aria-label="toggle password visibility"
                      >
                        {isVisiblePass ? (
                          <EyeSlashIcon className="text-blue-900 dark:text-black h-5 w-5  pointer-events-none" />
                        ) : (
                          <EyeIcon className="text-blue-900 dark:text-black h-5 w-5  pointer-events-none" />
                        )}
                      </button>
                    }
                    label="Nueva Contraseña"
                    placeholder="Contraseña"
                    value={password}
                    onValueChange={setPassword}
                    classNames={{
                      base: "",
                      input: "text-gray-900 dark:text-black",
                      inputWrapper:
                        "dark:bg-gray-100 dark:hover:bg-gray-100 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                    }}
                  />
                </div>
              </div>
              <div>
                <div align="center" className="space-x-2">
                  <Input
                    startContent={
                      <LockClosedIcon className="text-blue-900 dark:text-black h-5 w-5 " />
                    }
                    type={isVisiblePassConfirm ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityPassConfirm}
                        aria-label="toggle password visibility"
                      >
                        {isVisiblePassConfirm ? (
                          <EyeSlashIcon className="text-blue-900 dark:text-black h-5 w-5  pointer-events-none" />
                        ) : (
                          <EyeIcon className="text-blue-900 dark:text-black h-5 w-5  pointer-events-none" />
                        )}
                      </button>
                    }
                    label="Confirmar Nueva Contraseña"
                    placeholder="Confirma tu contraseña"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    classNames={{
                      base: "",
                      input: "text-gray-900 dark:text-black",
                      inputWrapper:
                        "dark:bg-gray-100 dark:hover:bg-gray-100 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                    }}
                  />
                </div>
              </div>
            </form>
          </CardBody>
          <CardFooter className="flex justify-center py-5">
            <Button
              type="submit"
              onPress={handleSubmit}
              className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
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
