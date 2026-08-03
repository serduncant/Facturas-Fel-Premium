import React from 'react';
import type { Receptor } from '../../types/entities';

interface ClientInfoProps {
  receptor: Receptor;
  borderColor: string;
}

export const ClientInfo: React.FC<ClientInfoProps> = ({ receptor, borderColor }) => (
  <div className="mb-6">
    <table className="w-full invoice-table" style={{ borderWidth: 2, borderColor }}>
      <tbody>
        <tr>
          <td className="py-2 px-3" style={{ borderRight: `2px solid ${borderColor}`, borderBottom: `2px solid ${borderColor}` }}>
            <span className="font-bold">NOMBRE:</span> {receptor.nombre}
          </td>
          <td className="py-2 px-3 w-1/3" style={{ borderBottom: `2px solid ${borderColor}` }}>
            <span className="font-bold">NIT:</span> {receptor.nit}
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="py-2 px-3">
            <span className="font-bold">DIRECCIÓN:</span> {receptor.direccion || 'Ciudad'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
