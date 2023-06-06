import { CaseSensitivity, MatchType } from "constants/enums";
import { render, screen, userEvent } from "test_utils";
import FilterGroup from ".";

const defaultFilter = {
  caseSensitive: CaseSensitivity.Insensitive,
  matchType: MatchType.Exact,
  name: "myFilter",
  visible: true,
};

describe("filters", () => {
  const user = userEvent.setup();

  it("should display the name of the filter", () => {
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filter={defaultFilter}
      />
    );
    expect(screen.getByText(defaultFilter.name)).toBeInTheDocument();
  });

  it("should be able to toggle editing", async () => {
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={jest.fn()}
        filter={defaultFilter}
      />
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(screen.queryByText(defaultFilter.name)).toBeNull();
    expect(screen.getByDataCy("edit-filter-name")).toBeInTheDocument();
    expect(screen.getByDataCy("edit-filter-name")).toHaveValue(
      defaultFilter.name
    );

    expect(screen.getByDataCy("edit-filter-name")).toHaveFocus();
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("should call editFilter with the correct parameters", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />
    );
    // Clear the text input and submit a new filter.
    await user.click(screen.getByLabelText("Edit filter"));
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(screen.getByDataCy("edit-filter-name"), "newFilter");

    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    await user.click(confirmButton);

    expect(editFilter).toHaveBeenCalledTimes(1);
    expect(editFilter).toHaveBeenCalledWith("name", "newFilter", defaultFilter);
  });

  it("should prevent the user from submitting an invalid filter", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />
    );
    // Clear the text input and submit a new filter.
    await user.click(screen.getByLabelText("Edit filter"));
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(
      screen.getByDataCy("edit-filter-name"),
      "some [[invalid regex"
    );
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    await user.clear(screen.getByDataCy("edit-filter-name"));
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should toggle between visibility icons when they are clicked", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />
    );
    expect(screen.getByLabelText("Visibility Icon")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Hide filter"));
    expect(editFilter).toHaveBeenCalledTimes(1);
    expect(editFilter).toHaveBeenCalledWith("visible", false, defaultFilter);
  });

  it("should call deleteFilter with the correct parameters", async () => {
    const deleteFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={deleteFilter}
        editFilter={jest.fn()}
        filter={defaultFilter}
      />
    );
    await user.click(screen.getByLabelText("Delete filter"));
    expect(deleteFilter).toHaveBeenCalledTimes(1);
    expect(deleteFilter).toHaveBeenCalledWith("myFilter");
  });

  it("should be able to interact with Case Sensitivity segmented control", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />
    );

    const insensitiveOption = screen.getByRole("tab", {
      name: "Insensitive",
    });
    const sensitiveOption = screen.getByRole("tab", {
      name: "Sensitive",
    });

    expect(insensitiveOption).toHaveAttribute("aria-selected", "true");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "false");

    await user.click(sensitiveOption);

    expect(insensitiveOption).toHaveAttribute("aria-selected", "false");
    expect(sensitiveOption).toHaveAttribute("aria-selected", "true");

    expect(editFilter).toHaveBeenCalledWith(
      "caseSensitive",
      CaseSensitivity.Sensitive,
      defaultFilter
    );
  });

  it("should be able to interact with Match Type segmented control", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={defaultFilter}
      />
    );

    const exactOption = screen.getByRole("tab", {
      name: "Exact",
    });
    const inverseOption = screen.getByRole("tab", {
      name: "Inverse",
    });

    expect(exactOption).toHaveAttribute("aria-selected", "true");
    expect(inverseOption).toHaveAttribute("aria-selected", "false");

    await user.click(inverseOption);

    expect(exactOption).toHaveAttribute("aria-selected", "false");
    expect(inverseOption).toHaveAttribute("aria-selected", "true");

    expect(editFilter).toHaveBeenCalledWith(
      "matchType",
      MatchType.Inverse,
      defaultFilter
    );
  });

  it("should display an error message when the provided filter regular expression is invalid", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, name: "invalid (regex" }}
      />
    );
    expect(
      screen.getByLabelText("Important With Circle Icon")
    ).toBeInTheDocument();
    await userEvent.hover(screen.getByLabelText("Important With Circle Icon"));
    await expect(
      screen.findByText("Invalid filter expression, please update it!")
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText("Invalid Regular Expression: Unterminated group")
    ).resolves.toBeInTheDocument();
  });
  it("should disable all inputs except editing or deleting for an invalid filter regular expression", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, name: "invalid (regex" }}
      />
    );
    expect(screen.getByLabelText("Hide filter")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });
  it("should allow reenabling a invalid filter after it has been fixed", async () => {
    const editFilter = jest.fn();
    render(
      <FilterGroup
        deleteFilter={jest.fn()}
        editFilter={editFilter}
        filter={{ ...defaultFilter, name: "invalid (regex" }}
      />
    );
    await user.click(screen.getByLabelText("Edit filter"));
    expect(
      screen.getByText("Invalid Regular Expression: Unterminated group")
    ).toBeInTheDocument();
    const confirmButton = screen.getByRole("button", {
      name: "Apply",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    await user.clear(screen.getByDataCy("edit-filter-name"));
    await user.type(screen.getByDataCy("edit-filter-name"), "newFilter");
    expect(
      screen.queryByText("Invalid Regular Expression: Unterminated group")
    ).not.toBeInTheDocument();
    expect(confirmButton).toHaveAttribute("aria-disabled", "false");
  });
});
