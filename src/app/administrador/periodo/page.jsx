"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";

import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function Periodo() {
  // Datos ficticios para los periodos
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "nombre",
    direction: "ascending",
  });
  const [isClient, setIsClient] = useState(false);

  // Columnas para la tabla
  const headerColumns = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Inicio", uid: "inicio", sortable: true },
    { name: "Fin", uid: "fin", sortable: true },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  useEffect(() => {
    setIsClient(true);
    const data = [
      {
        id: 1,
        nombre: "Periodo 1",
        estado: "Activo",
        inicio: "2024-01-01",
        fin: "2024-06-30",
      },
      {
        id: 2,
        nombre: "Periodo 2",
        estado: "Inactivo",
        inicio: "2024-07-01",
        fin: "2024-12-31",
      },
    ];
    setItems(data);
    setFilteredItems(data); // Inicialmente sin filtros
  }, []);

  // Función para manejar la búsqueda
  const onSearchChange = (value) => {
    const filtered = items.filter((item) =>
      item.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Función para limpiar la búsqueda
  const onClear = () => {
    setFilteredItems(items);
  };

  // Función para renderizar las celdas de la tabla
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "acciones":
        return <Chip color="primary">Acciones</Chip>;
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 h-screen w-full px-10">
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Periodos Académicos
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de los periodos académicos de la escuela.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<MagnifyingGlassIcon className="h-6 w-6" />}
            onClear={onClear}
            onValueChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <ChevronDownIcon className="text-small h-3 w-3" />
                  }
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
              >
                <DropdownItem key="activo">Activo</DropdownItem>
                <DropdownItem key="inactivo">Inactivo</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              color="primary"
              endContent={<PlusIcon className="h-5 w-5" />}
            >
              Añadir Nuevo
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} periodos
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              // Aquí podría agregarse lógica para manejar el cambio
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>

      {isClient && (
        <Table
          aria-label="Tabla de periodos académicos"
          isHeaderSticky
          classNames={{ wrapper: "max-h-[382px]" }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "acciones" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No se encontraron periodos"}
            items={filteredItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Periodo;
