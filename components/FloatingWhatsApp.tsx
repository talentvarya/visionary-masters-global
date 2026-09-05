"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";

const WHATSAPP_NUMBER = "97471913089";
const STORAGE_KEY = "vmg-whatsapp-position";
const DRAG_THRESHOLD = 4; // px of movement before it counts as a drag, not a click
const BUTTON_SIZE = 56;
const EDGE_GAP = 20;

type Position = { x: number; y: number };

export default function FloatingWhatsApp() {
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);

  const positionRef = useRef<Position | null>(null);
  const offsetRef = useRef<Position>({ x: 0, y: 0 });
  const startRef = useRef<Position>({ x: 0, y: 0 });
  const movedRef = useRef(false);

  const applyPosition = useCallback((next: Position) => {
    positionRef.current = next;
    setPosition(next);
  }, []);

  // Default: bottom-right, or wherever the user last dropped it.
  useEffect(() => {
    const clampToViewport = (p: Position): Position => ({
      x: Math.min(Math.max(p.x, EDGE_GAP), window.innerWidth - BUTTON_SIZE - EDGE_GAP),
      y: Math.min(Math.max(p.y, EDGE_GAP), window.innerHeight - BUTTON_SIZE - EDGE_GAP),
    });

    let initial: Position = {
      x: window.innerWidth - BUTTON_SIZE - EDGE_GAP,
      y: window.innerHeight - BUTTON_SIZE - EDGE_GAP * 3,
    };

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) initial = JSON.parse(stored) as Position;
    } catch {
      // ignore unreadable storage
    }

    const clamped = clampToViewport(initial);
    positionRef.current = clamped;
    setPosition(clamped);
  }, []);

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      const current = positionRef.current;
      if (!current) return;

      movedRef.current = false;
      startRef.current = { x: clientX, y: clientY };
      offsetRef.current = { x: clientX - current.x, y: clientY - current.y };
      setDragging(true);

      const clamp = (value: number, max: number) => Math.min(Math.max(value, EDGE_GAP), max);

      const handleMove = (clientMoveX: number, clientMoveY: number) => {
        const dx = Math.abs(clientMoveX - startRef.current.x);
        const dy = Math.abs(clientMoveY - startRef.current.y);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) movedRef.current = true;

        // Until the pointer clears the threshold this is still a click, not a
        // drag — don't nudge the button around under the user's finger.
        if (!movedRef.current) return;

        applyPosition({
          x: clamp(clientMoveX - offsetRef.current.x, window.innerWidth - BUTTON_SIZE - EDGE_GAP),
          y: clamp(clientMoveY - offsetRef.current.y, window.innerHeight - BUTTON_SIZE - EDGE_GAP),
        });
      };

      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
      const onTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        if (touch) handleMove(touch.clientX, touch.clientY);
      };

      const cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onEnd);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onEnd);
        setDragging(false);

        if (movedRef.current && positionRef.current) {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(positionRef.current));
          } catch {
            // ignore storage failures
          }
        }
      };

      function onEnd() {
        cleanup();
      }

      // Attached synchronously so even a fast drag is tracked from the first pixel.
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    },
    [applyPosition]
  );

  if (!position) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        // A drag shouldn't also open WhatsApp.
        if (movedRef.current) {
          e.preventDefault();
          movedRef.current = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={(e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const touch = e.touches[0];
        if (touch) startDrag(touch.clientX, touch.clientY);
      }}
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp — drag to move"
      style={{
        left: position.x,
        top: position.y,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      className={`fixed z-50 flex select-none items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ${
        dragging ? "scale-105" : "animate-pulse-ring"
      }`}
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
