"use client";
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
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

const SortableItem = ({ id, team, pick }: DraggableTeam) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full h-full">
      <Team
        pickNumber={pick}
        teamName={team.team_name}
        logoURL={`/images/${team.team_name}.png`}
      />
    </div>
  );
};

const DraftOrderGrid: React.FC<DraftOrderGridProps> = ({ draftCapital, setDraftCapital }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDraftCapital((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({
          ...item,
          pick: index + 1,
          team: {
            ...item.team,
            picks: item.team.picks.map((pick, pickIndex) =>
              pickIndex === 0 ? index + 1 : pick
            )
          },
          id: `${item.team.team_name}-${index + 1}`
        }));
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={draftCapital} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {draftCapital.map((item) => (
            <SortableItem key={item.id} {...item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraftOrderGrid;