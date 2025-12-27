'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { requests, equipment } from '@/lib/data';
import type { MaintenanceRequest } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScheduleTaskForm } from './schedule-task-form';
import { useToast } from '@/hooks/use-toast';

export function MaintenanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const role = 'Manager'; // Default to manager view

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const tasksByDate = requests.reduce((acc, task) => {
    const date = format(task.scheduledDate, 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, MaintenanceRequest[]>);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    if (role !== 'Manager') return;
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    // In a real app with a server, we'd refetch or use a more robust state management
    // For now, we rely on the action's revalidation, but a toast gives user feedback
    toast({
      title: "Task Scheduled",
      description: "The calendar will update with the new task.",
    });
    // A simple refresh to show changes for the demo
    window.location.reload();
  };

  return (
    <>
      <div className="bg-card rounded-xl shadow-sm p-4 w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground pb-2 border-b">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 grid-rows-5 gap-px">
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const tasks = tasksByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);

            const hasHighPriority = tasks.some(t => t.priority === 'High');
            const hasMediumPriority = tasks.some(t => t.priority === 'Medium');
            const hasLowPriority = tasks.some(t => t.priority === 'Low');

            return (
              <div
                key={day.toString()}
                className={cn(
                  'relative flex flex-col p-2 min-h-[120px] bg-card border-t border-l group/day',
                  !isCurrentMonth && 'bg-muted/50 text-muted-foreground',
                   isSameDay(day, new Date()) ? 'day today' : 'day',
                   role === 'Manager' && 'cursor-pointer'
                )}
                onClick={() => handleDateClick(day)}
              >
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={cn(
                    'font-semibold text-sm',
                    isToday(day) && !isSameDay(day, new Date()) && 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                  )}
                >
                  {format(day, 'd')}
                </time>
                <div className="flex items-center space-x-1 mt-1">
                    {hasHighPriority && <div className="dot high"></div>}
                    {hasMediumPriority && <div className="dot medium"></div>}
                    {hasLowPriority && <div className="dot low"></div>}
                </div>
                <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                    {tasks.slice(0, 2).map(task => (
                         <Badge key={task.id} variant="secondary" className="w-full truncate block text-left font-normal py-1">
                            {task.subject}
                         </Badge>
                    ))}
                    {tasks.length > 2 && (
                        <p className="text-xs text-muted-foreground mt-1">+{tasks.length - 2} more</p>
                    )}
                </div>
                 {role === 'Manager' && (
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/day:opacity-100">
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {role === 'Manager' && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Preventive Task</DialogTitle>
              <DialogDescription>
                Schedule a new preventive maintenance task for {selectedDate && format(selectedDate, 'PPP')}.
              </DialogDescription>
            </DialogHeader>
            {selectedDate && (
                 <ScheduleTaskForm
                    scheduledDate={selectedDate}
                    allEquipment={equipment}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
