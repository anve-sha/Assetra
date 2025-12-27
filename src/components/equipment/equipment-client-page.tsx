'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AddEquipmentForm } from './add-equipment-form';
import { teams, technicians } from '@/lib/data';
import { cn } from '@/lib/utils';

export function EquipmentClientPage({
  allEquipment,
}: {
  allEquipment: Equipment[];
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const role = 'Manager'; // Default to manager view
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const filteredEquipment = allEquipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const statusClasses = (isScrapped: boolean) =>
    isScrapped ? 'bg-status-scrap-bg text-status-scrap-text' : 'bg-status-repaired-bg text-status-repaired-text';

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {role === 'Manager' && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <Link href={`/equipment/${item.id}`} className="block">
                <div className="relative h-40 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={item.imageHint}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <Badge variant={'outline'} className={cn("capitalize border-0 font-semibold", statusClasses(item.isScrapped))}>
                      {item.isScrapped ? 'Scrapped' : 'Active'}
                    </Badge>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {role === 'Manager' && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new piece of equipment to the system.
              </DialogDescription>
            </DialogHeader>
            <AddEquipmentForm
              teams={teams}
              technicians={technicians}
              onSuccess={() => setIsAddDialogOpen(false)}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
