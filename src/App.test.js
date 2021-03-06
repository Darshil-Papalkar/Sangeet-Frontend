import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import Home from "./pages/Home";

test('pass functions to matchers', () => {
  render(<Home />);
  // const linkElement = screen.getByText("SANGEET");
  // expect(linkElement).toBeInTheDocument();

  screen.getByText((content, node) => {
    const hasText = (node) => node.textContent === "SANGEET";
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));

    return nodeHasText && childrenDontHaveText;
  });
});
