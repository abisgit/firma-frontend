"use client";

import { useState } from 'react';
import { ArrowLeft, Send, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sectors = [
    { id: '1', name: 'Ministry of Planning', phone: '+251-11-123-4567', location: 'Addis Ababa, Bole' },
    { id: '2', name: 'Ministry of Health', phone: '+251-11-234-5678', location: 'Addis Ababa, Kirkos' },
    { id: '3', name: 'Ministry of Education', phone: '+251-11-345-6789', location: 'Addis Ababa, Arada' },
    { id: '4', name: 'Regional Office - Oromia', phone: '+251-11-456-7890', location: 'Adama' },
    { id: '5', name: 'Regional Office - Amhara', phone: '+251-58-111-2222', location: 'Bahir Dar' },
    { id: '6', name: 'Regional Office - Tigray', phone: '+251-34-444-5555', location: 'Mekelle' },
];

export default function LetterCCPage() {
    const router = useRouter();
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

    const toggleSector = (sectorId: string) => {
        setSelectedSectors(prev =>
            prev.includes(sectorId)
                ? prev.filter(id => id !== sectorId)
                : [...prev, sectorId]
        );
    };

    const handleSendCC = () => {
        if (selectedSectors.length === 0) {
            alert('Please select at least one sector to send CC');
            return;
        }
        console.log('Sending CC to sectors:', selectedSectors);
        alert(`Letter CC sent to ${selectedSectors.length} sector(s)`);
        router.push('/org/letters');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/org/letters/create" className="p-2 hover:bg-muted rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-primary">Copy/CC Letter to Sectors</h2>
                        <p className="text-sm text-muted-foreground">
                            Select cross-structure sectors to receive a copy of this letter
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{selectedSectors.length}</span> sector(s) selected
                </div>
            </div>

            {/* Letter Preview Card */}
            <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Letter Details</h3>
                <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">Budget Approval Request Q1 2026</p>
                    <p className="text-sm text-muted-foreground">Reference: MOF/2026/001</p>
                    <p className="text-sm text-muted-foreground">Date: January 21, 2026</p>
                </div>
            </div>

            {/* Sectors Selection Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-primary">Select Sectors for CC</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedSectors.length === sectors.length}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedSectors(sectors.map(s => s.id));
                                            } else {
                                                setSelectedSectors([]);
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                </th>
                                <th className="px-6 py-4 font-medium">#</th>
                                <th className="px-6 py-4 font-medium">Sector Name</th>
                                <th className="px-6 py-4 font-medium">Phone No</th>
                                <th className="px-6 py-4 font-medium">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sectors.map((sector, index) => {
                                const isSelected = selectedSectors.includes(sector.id);
                                return (
                                    <tr
                                        key={sector.id}
                                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                                            }`}
                                        onClick={() => toggleSector(sector.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSector(sector.id)}
                                                    className="w-4 h-4 rounded border-border"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {isSelected && <Check className="w-4 h-4 text-primary" />}
                                                <span className="font-medium text-foreground">{sector.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                                            {sector.phone}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {sector.location}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <Link
                    href="/org/letters/create"
                    className="px-6 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSendCC}
                    disabled={selectedSectors.length === 0}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md transition-colors ${selectedSectors.length > 0
                            ? 'bg-primary text-white hover:bg-secondary'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                >
                    <Send className="w-4 h-4" />
                    Send CC to {selectedSectors.length} Sector{selectedSectors.length !== 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
}
