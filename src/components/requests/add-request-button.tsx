'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddRequestModal } from './add-request-modal';
import type { Equipment, MaintenanceRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function AddRequestButton({ allEquipment }: { allEquipment: Equipment[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = (newRequest: MaintenanceRequest) => {
    toast({
      title: 'Request Created',
      description: `Request "${newRequest.subject}" has been successfully created.`,
    });
    setIsModalOpen(false);
    // This is a client component, so we can't use revalidatePath directly.
    // Instead, we'll rely on the parent component to update the state.
    // However, if this button were used in a server component context that needs revalidation,
    // you would typically trigger it from the server action.
    window.location.reload(); // Simple way to see the update for now
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Request
      </Button>
      <AddRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        allEquipment={allEquipment}
        onSuccess={handleSuccess}
      />
    </>
  );
}
