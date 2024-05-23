import React, { useState } from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Quote {
  id: string;
  content: string;
}

const initial: Quote[] = Array.from({ length: 10 }, (_, k) => ({
  id: `id-${k}`,
  content: `Quote ${k}`,
}));

const grid = 8;

const reorder = (
  list: Quote[],
  startIndex: number,
  endIndex: number
): Quote[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: lightblue;
  padding: ${grid}px;
  cursor: pointer;
`;

const QuoteComponent: React.FC<{ quote: Quote; index: number }> = ({
  quote,
  index,
}) => (
  <Draggable draggableId={quote.id} index={index}>
    {(provided) => (
      <QuoteItem
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {quote.content}
      </QuoteItem>
    )}
  </Draggable>
);

const QuoteList: React.FC<{ quotes: Quote[] }> = React.memo(({ quotes }) => (
  <>
    {quotes.map((quote, index) => (
      <QuoteComponent quote={quote} index={index} key={quote.id} />
    ))}
  </>
));

function QuoteApp() {
  const [quotes, setQuotes] = useState(initial);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedQuotes = reorder(
      quotes,
      result.source.index,
      result.destination.index
    );

    setQuotes(reorderedQuotes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <QuoteList quotes={quotes} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default QuoteApp;
