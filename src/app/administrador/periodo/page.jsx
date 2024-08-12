"use client";
import React, { useState } from "react";

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
  Pagination,
} from "@nextui-org/react";

import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function Periodo() {
  // Datos ficticios para los periodos
  const [items, setItems] = useState([
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
  ]);

  // Estados locales para la búsqueda, selección y ordenamiento
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(new Set());
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [sortDescriptor, setSortDescriptor] = useState({});

  // Funciones auxiliares
  const onSearchChange = (value) => {
    setSearchTerm(value);
  };

  const onClear = () => {
    setSearchTerm("");
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "nombre":
        return item.nombre;
      case "estado":
        return item.estado;
      case "inicio":
        return item.inicio;
      case "fin":
        return item.fin;
      default:
        return null;
    }
  };

  // Filtrar y ordenar los datos según los criterios actuales
  const filteredItems = items
    .filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter.size === 0 || statusFilter.has(item.estado))
    )
    .sort((a, b) => {
      if (sortDescriptor.columnKey) {
        if (sortDescriptor.direction === "descending") {
          return a[sortDescriptor.columnKey] < b[sortDescriptor.columnKey]
            ? 1
            : -1;
        }
        return a[sortDescriptor.columnKey] > b[sortDescriptor.columnKey]
          ? 1
          : -1;
      }
      return 0;
    });

  const headerColumns = [
    { uid: "nombre", name: "Nombre", sortable: true },
    { uid: "estado", name: "Estado", sortable: true },
    { uid: "inicio", name: "Inicio", sortable: true },
    { uid: "fin", name: "Fin", sortable: true },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 h-screen w-full px-10">
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Periodos
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Gestión de periodos académicos
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<MagnifyingGlassIcon className="h-6 w-6" />}
            value={searchTerm}
            onClear={onClear}
            onValueChange={onSearchChange}
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
                aria-label="Estados"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                <DropdownItem key="Activo">Activo</DropdownItem>
                <DropdownItem key="Inactivo">Inactivo</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              color="primary"
              endContent={<PlusIcon className="h-5 w-5" />}
            >
              Agregar nuevo
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} periodos
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select className="bg-transparent outline-none text-default-400 text-small">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>

      <div>
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
                align={column.uid === "estado" ? "center" : "start"}
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
      </div>
    </div>
  );
}

export default Periodo;
