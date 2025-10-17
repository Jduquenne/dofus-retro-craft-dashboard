import { Save, X, Edit2 } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { Resource } from "../types";

export const ResourcesManager: React.FC = () => {
    const { resources, setResources } = useAppContext();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Resource>>({});

    const startEdit = (resource: Resource) => {
        setEditingId(resource.id);
        setEditForm(resource);
    };

    const saveEdit = () => {
        if (editingId) {
            setResources(resources.map(r => r.id === editingId ? { ...r, ...editForm } as Resource : r));
            setEditingId(null);
            setEditForm({});
        }
    };

    const totalValue = resources.reduce((sum, r) => sum + r.quantity * r.unitPrice, 0);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Inventaire des Ressources</h2>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Valeur totale</div>
                        <div className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()}k</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-2">Ressource</th>
                                <th className="text-left py-3 px-2">Type</th>
                                <th className="text-right py-3 px-2">Quantité</th>
                                <th className="text-right py-3 px-2">Prix unitaire</th>
                                <th className="text-right py-3 px-2">Valeur totale</th>
                                <th className="text-center py-3 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map(resource => (
                                <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    {editingId === resource.id ? (
                                        <>
                                            <td className="py-3 px-2">
                                                <input
                                                    type="text"
                                                    value={editForm.name || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    type="text"
                                                    value={editForm.type || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    type="number"
                                                    value={editForm.quantity || 0}
                                                    onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                                                    className="w-full px-2 py-1 border rounded text-right"
                                                />
                                            </td>
                                            <td className="py-3 px-2">
                                                <input
                                                    type="number"
                                                    value={editForm.unitPrice || 0}
                                                    onChange={(e) => setEditForm({ ...editForm, unitPrice: Number(e.target.value) })}
                                                    className="w-full px-2 py-1 border rounded text-right"
                                                />
                                            </td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                {((editForm.quantity || 0) * (editForm.unitPrice || 0)).toLocaleString()}k
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={saveEdit}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingId(null); setEditForm({}); }}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-3 px-2 font-medium">{resource.name}</td>
                                            <td className="py-3 px-2">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right">{resource.quantity}</td>
                                            <td className="py-3 px-2 text-right">{resource.unitPrice}k</td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                {(resource.quantity * resource.unitPrice).toLocaleString()}k
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => startEdit(resource)}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};