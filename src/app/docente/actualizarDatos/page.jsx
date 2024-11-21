"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  User,
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

function ActualizarDatos() {
  const [correo, setCorreo] = useState(localStorage.getItem("correo"));
  const [celular, setCelular] = useState(localStorage.getItem("telefono"));
  const [foto, setFoto] = useState(localStorage.getItem("foto"));
  const [nombre, setNombre] = useState(localStorage.getItem("nombre"));
  const [apellido, setApellido] = useState(localStorage.getItem("apellido"));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisiblePassConfirm, setIsVisiblePassConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert("Datos actualizados correctamente");
  };

  const toggleVisibilityPass = () => setIsVisiblePass(!isVisiblePass);
  const toggleVisibilityPassConfirm = () =>
    setIsVisiblePassConfirm(!isVisiblePassConfirm);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
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
            <Avatar
              src={foto}
              className="w-28 h-28 text-large"
            />
            <p className="dark:text-white font-bold text-2xl">
              {nombre} {apellido}
            </p>
            <p className="text-base text-blue-900 dark:text-white font-extralight">
              {correo}
            </p>
          </CardHeader>
          <CardBody className="px-5">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(e) => setCorreo(e.target.value)}
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
                    onChange={(e) => setCelular(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={handleSubmit}
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
