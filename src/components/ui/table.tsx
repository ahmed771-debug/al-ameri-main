"use client";

import React, { JSXElementConstructor } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBodyProps,
} from "@nextui-org/react";

interface TableColumn {
  key: string;
  label: string;
}

export interface ReusableTableProps {
  columns: TableColumn[];
  options?: string[];
  bottomContent?: React.ReactNode;
  topContent?: React.ReactNode;
  onRowAction?: (col: any) => void;
  fontSize?: string;
  children: React.ReactElement<
    TableBodyProps<object>,
    string | JSXElementConstructor<any>
  >;
}

const GRSTable: React.FC<ReusableTableProps> = ({
  columns,
  fontSize,
  options = [],
  children,
  ...props
}) => {
  return (
    <Table isStriped={true} {...props} shadow="none">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            aria-label={column.label}
            className={`${fontSize} font-medium h-14 ${
              options.includes(column.key) ? "text-center" : "text-start"
            }`}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      {children}
    </Table>
  );
};

export default GRSTable;
