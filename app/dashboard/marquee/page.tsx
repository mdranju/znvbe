"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  Zap,
  GripVertical,
  Save,
} from "lucide-react";
import {
  useGetAllAdminMarqueesQuery,
  useCreateMarqueeMutation,
  useUpdateMarqueeMutation,
  useDeleteMarqueeMutation,
  useReorderMarqueesMutation,
} from "@/src/store/api/adminApi";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { TableRowSkeleton } from "@/components/ui/SkeletonComponents";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function MarqueeManagementPage() {
  const { data: marqueeData, isLoading } = useGetAllAdminMarqueesQuery();
  const [createMarquee] = useCreateMarqueeMutation();
  const [updateMarquee] = useUpdateMarqueeMutation();
  const [deleteMarquee] = useDeleteMarqueeMutation();
  const [reorderMarquees] = useReorderMarqueesMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    link: "",
    status: "active",
    order: 0,
  });
  const [orderedItems, setOrderedItems] = useState<any[]>([]);

  useEffect(() => {
    const data = marqueeData?.data || marqueeData || [];
    if (Array.isArray(data)) {
      setOrderedItems(
        [...data].sort((a, b) => (a.order || 0) - (b.order || 0)),
      );
    }
  }, [marqueeData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedItems((items) => {
        const oldIndex = items.findIndex((i) => (i.id || i._id) === active.id);
        const newIndex = items.findIndex((i) => (i.id || i._id) === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    try {
      const payload = orderedItems.map((item, index) => ({
        id: item.id || item._id,
        order: index,
      }));
      await reorderMarquees(payload).unwrap();
      toast.success("Success", { description: "Layout sequence synchronized" });
    } catch (err) {
      toast.error("Error", { description: "Failed to synchronize order" });
    }
  };

  const handleCreate = async () => {
    try {
      await createMarquee(formData).unwrap();
      toast.success("Created", {
        description: "Marquee item added successfully",
      });
      setIsAdding(false);
      setFormData({ text: "", link: "", status: "active", order: 0 });
    } catch (err) {
      toast.error("Error", { description: "Failed to create marquee" });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateMarquee({ id, data: formData }).unwrap();
      toast.success("Updated", {
        description: "Marquee item updated successfully",
      });
      setEditingId(null);
      setFormData({ text: "", link: "", status: "active", order: 0 });
    } catch (err) {
      toast.error("Error", { description: "Failed to update marquee" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this marquee?")) {
      try {
        await deleteMarquee(id).unwrap();
        toast.success("Deleted", { description: "Marquee item removed" });
      } catch (err) {
        toast.error("Error", { description: "Failed to delete marquee" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Marquee Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your storefront announcement ticker items
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveOrder}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-black active:scale-95"
          >
            <Save size={18} />
            Save Order
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <Plus size={18} />
            Add Marquee
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedItems.map((m) => m.id || m._id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody className="divide-y divide-black/5">
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => <TableRowSkeleton key={i} columns={4} />)
                  ) : orderedItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center">
                        <Zap className="mx-auto text-gray-100 mb-4" size={48} />
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                          No Active Frequencies
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orderedItems.map((item: any) => (
                      <SortableRow
                        key={item.id || item._id}
                        marquee={item}
                        editingId={editingId}
                        formData={formData}
                        setFormData={setFormData}
                        handleUpdate={handleUpdate}
                        setEditingId={setEditingId}
                        handleDelete={handleDelete}
                      />
                    ))
                  )}
                  {isAdding && (
                    <tr className="bg-blue-50/50 animate-in fade-in slide-in-from-left-4 duration-500">
                      <td className="px-8 py-6">
                        <input
                          type="text"
                          value={formData.text}
                          onChange={(e) =>
                            setFormData({ ...formData, text: e.target.value })
                          }
                          className="w-full px-5 py-3 border border-blue-200 rounded-2xl font-bold bg-white focus:ring-4 ring-blue-500/10 outline-none transition-all"
                          placeholder="Message content..."
                        />
                      </td>
                      <td className="px-8 py-6">
                        <input
                          type="text"
                          value={formData.link}
                          onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                          }
                          className="w-full px-5 py-3 border border-blue-200 rounded-2xl font-medium bg-white focus:ring-4 ring-blue-500/10 outline-none transition-all"
                          placeholder="URL (optional)"
                        />
                      </td>
                      <td className="px-8 py-6">
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="px-5 py-3 border border-blue-200 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-white focus:ring-4 ring-blue-500/10 outline-none transition-all"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={handleCreate}
                            className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setIsAdding(false)}
                            className="p-4 bg-white border border-black/5 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortableRow({
  marquee,
  editingId,
  formData,
  setFormData,
  handleUpdate,
  setEditingId,
  handleDelete,
}: any) {
  const id = marquee.id || marquee._id;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    position: isDragging ? "relative" : ("static" as any),
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group hover:bg-gray-50 transition-colors ${isDragging ? "bg-white shadow-xl opacity-90 scale-[1.01] ring-1 ring-blue-500/10" : ""}`}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-600 transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={18} />
          </button>
          {editingId === id ? (
            <input
              type="text"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-xl font-semibold bg-white focus:ring-4 ring-blue-500/5 outline-none transition-all"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="font-semibold text-gray-900">
                {marquee.text}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {editingId === id ? (
          <input
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl font-medium focus:ring-4 ring-blue-500/5 outline-none transition-all"
            placeholder="Protocol Link"
          />
        ) : (
          <span className="text-xs text-gray-400">
            {marquee.link || "—"}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {editingId === id ? (
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-xl font-bold uppercase text-[10px] tracking-wider focus:ring-4 ring-blue-500/5 outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              marquee.status === "active"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-gray-50 text-gray-400 border border-gray-100"
            }`}
          >
            {marquee.status}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {editingId === id ? (
            <>
              <button
                onClick={() => handleUpdate(id)}
                className="p-2 bg-emerald-500 text-white rounded-lg transition-all hover:bg-emerald-600 active:scale-95"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="p-2 bg-gray-100 text-gray-500 rounded-lg transition-all hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditingId(id);
                  setFormData({
                    text: marquee.text,
                    link: marquee.link || "",
                    status: marquee.status || "active",
                    order: marquee.order || 0,
                  });
                }}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
