import { render, screen, userEvent } from "test_utils";
import Accordion from ".";

describe("accordion", () => {
  it("properly expands and collapses", async () => {
    const user = userEvent.setup();
    render(
      <Accordion title="collapsed" toggledTitle="expanded">
        accordion content
      </Accordion>
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByText("expanded")).toBeInTheDocument();
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByText("collapsed")).toBeInTheDocument();
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("should be expanded if defaultOpen is true", () => {
    render(
      <Accordion defaultOpen title="accordion title">
        accordion content
      </Accordion>
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("calls onToggle when accordion is toggled", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    render(
      <Accordion onToggle={onToggle} title="accordion title">
        accordion content
      </Accordion>
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("uses titleTag if provided", () => {
    const titleTag = () => <span data-cy="my-custom-tag" />;
    render(
      <Accordion title="accordion title" titleTag={titleTag}>
        accordion content
      </Accordion>
    );
    expect(screen.getByDataCy("my-custom-tag")).toBeInTheDocument();
  });
});
