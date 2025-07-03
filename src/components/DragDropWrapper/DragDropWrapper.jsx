import React, { useState, useRef, useEffect } from "react";
import "./DragDropWrapper.scss";

const DragDropWrapper = ({ items, onDrop, renderItem }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const containerRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const lastScrollTimeRef = useRef(0);
  const scrollSpeedRef = useRef(0);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { top, bottom, height } = container.getBoundingClientRect();
    const mouseY = event.clientY;
    const threshold = height * 0.4;
    const scrollZoneHeight = height * 0.3; 
    if (mouseY < top + threshold) {
      const distanceFromEdge = top + threshold - mouseY;
      scrollSpeedRef.current = Math.min(
        30,
        5 + (distanceFromEdge / scrollZoneHeight) * 25
      );
      startAutoScroll(-scrollSpeedRef.current);
    } else if (mouseY > bottom - threshold) {
      const distanceFromEdge = mouseY - (bottom - threshold);
      scrollSpeedRef.current = Math.min(
        30,
        5 + (distanceFromEdge / scrollZoneHeight) * 25
      );
      startAutoScroll(scrollSpeedRef.current);
    } else {
      stopAutoScroll();
    }
  };

  const startAutoScroll = (speed) => {
    if (scrollAnimationRef.current) return;

    const scroll = (timestamp) => {
      if (!lastScrollTimeRef.current) {
        lastScrollTimeRef.current = timestamp;
      }

      const delta = timestamp - lastScrollTimeRef.current;
      if (delta > 16) {
        // Roughly 60fps
        containerRef.current.scrollTop += speed * (delta / 16);
        lastScrollTimeRef.current = timestamp;
      }

      scrollAnimationRef.current = requestAnimationFrame(scroll);
    };

    scrollAnimationRef.current = requestAnimationFrame(scroll);
  };

  const stopAutoScroll = () => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
      lastScrollTimeRef.current = 0;
      scrollSpeedRef.current = 0;
    }
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    onDrop(draggedIndex, index);
    setDraggedIndex(null);
    stopAutoScroll();
  };

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, []);

  return (
    <div className="drag" ref={containerRef} onDragLeave={stopAutoScroll}>
      {items.map((item, index) => (
        <div
          className={`drag-container ${
            draggedIndex === index ? "dragging" : ""
          }`}
          key={item.id || index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          onDragEnd={stopAutoScroll}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default DragDropWrapper;
