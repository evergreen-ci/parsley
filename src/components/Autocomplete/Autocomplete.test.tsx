import { render, screen, userEvent } from "test_utils";
import Autocomplete from ".";

describe("autocomplete", () => {
  it("shows suggestions when user types a partial match", async () => {
    render(
      <Autocomplete
        autocompleteSuggestions={["Sharded cluster", "(NETWORK|REPL_HB)"]}
        data-cy="autocomplete"
        label="autocomplete"
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByDataCy("autocomplete"), "Sha");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      "Sharded cluster"
    );
    await user.clear(screen.getByDataCy("autocomplete"));
    await user.type(screen.getByDataCy("autocomplete"), "(NET");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      "(NETWORK|REPL_HB)"
    );
  });

  it("applies suggestion on tab", async () => {
    render(
      <Autocomplete
        autocompleteSuggestions={["Sharded cluster", "(NETWORK|REPL_HB)"]}
        data-cy="autocomplete"
        label="autocomplete"
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByDataCy("autocomplete"), "Sha");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      "Sharded cluster"
    );
    await user.type(screen.getByDataCy("autocomplete"), "{Tab}");
    expect(screen.getByDataCy("autocomplete")).toHaveValue("Sharded cluster");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      ""
    );
  });

  it("applies suggestion on right arrow", async () => {
    render(
      <Autocomplete
        autocompleteSuggestions={["Sharded cluster", "(NETWORK|REPL_HB)"]}
        data-cy="autocomplete"
        label="autocomplete"
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByDataCy("autocomplete"), "Sha");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      "Sharded cluster"
    );
    await user.type(screen.getByDataCy("autocomplete"), "{ArrowRight}");
    expect(screen.getByDataCy("autocomplete")).toHaveValue("Sharded cluster");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      ""
    );
  });

  it("clears suggestion on enter", async () => {
    render(
      <Autocomplete
        autocompleteSuggestions={["Sharded cluster", "(NETWORK|REPL_HB)"]}
        data-cy="autocomplete"
        label="autocomplete"
      />
    );
    const user = userEvent.setup();
    await user.type(screen.getByDataCy("autocomplete"), "Sha");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      "Sharded cluster"
    );
    await user.type(screen.getByDataCy("autocomplete"), "{Enter}");
    expect(screen.getByDataCy("autocomplete")).toHaveValue("Sha");
    expect(screen.getByDataCy("autocomplete-suggestion")).toHaveAttribute(
      "placeholder",
      ""
    );
  });
});
