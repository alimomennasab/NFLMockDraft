"use client";
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Team from '../components/Team';

export interface TeamData {
  team_name: string;
  picks: number[];
}

export interface DraggableTeam {
  id: string;
  team: TeamData;
  pick: number;
}

interface DraftOrderGridProps {
  draftCapital: DraggableTeam[];
  setDraftCapital: React.Dispatch<React.SetStateAction<DraggableTeam[]>>;
}

// SortableItem component handles individual draggable items
const SortableItem = ({ id, team, pick }: DraggableTeam) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  // drag styling
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : 'static', 
    //background: isDragging ? 'rgba(34,197,94,0.5)' : 'auto' 
  };

  return (
    // wrap each team component in a draggable div
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="col-span-1 row-span-1">
      <Team
        pickNumber={pick}
        teamName={team.team_name}
        logoURL={'images/mizzou.png'}
      />
    </div>
  );
};

// DraftOrderGrid component handles the entire grid of draggable items
const DraftOrderGrid: React.FC<DraftOrderGridProps> = ({ draftCapital, setDraftCapital }) => {
  // sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // minimum distance for activation
      },
    })
  );

  // Handle the end of a drag
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDraftCapital((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id); // find the old index of the dragged item
        const newIndex = items.findIndex((item) => item.id === over.id); // find the new index of the dragged item
        const newItems = arrayMove(items, oldIndex, newIndex);

        // update the pick number based on the new index
        return newItems.map((item, index) => ({
          ...item,
          pick: index + 1
        }));
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={draftCapital} strategy={rectSortingStrategy}>
        <div className='grid grid-cols-4 gap-2'>
          {draftCapital.map((item) => (
            <SortableItem key={item.id} {...item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraftOrderGrid;
