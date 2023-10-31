# Search a Log

**Line Wrapping:** 
Log lines can be wrapped/unwrapped by toggling the wrap button under show details. 

![wrap](https://user-images.githubusercontent.com/624531/207634738-6cde452e-4c0c-46e1-a9d8-01aa3b3dae20.png)

## Search

To search for a term in a log, enter a regexp search term in the search bar with the "Search" mode active. Hit enter to navigate to the first appearance of the term. You can paginate through the search results by either manually clicking on the next and previous buttons, or using the n and p keys on your keyboard. 

![search example](https://user-images.githubusercontent.com/624531/207634781-776f1cd4-a261-4d44-bb36-f29a62a13847.png)

As seen above, search is case insensitive by default. Open the details menu to toggle to turn case sensitivity on and off. Note that the case sensitivity toggle only affects searching, having no effect on filtering or highlighting. 

![case sensetive](https://user-images.githubusercontent.com/624531/207634810-65b64124-1c52-4cd5-a45c-dd9a41906f4f.png)

You can limit your search between the certain lines by specifying a range in the details menu. 
 
![range](https://user-images.githubusercontent.com/624531/207634831-130847b4-ce1c-43b2-973f-989b5de3a2a1.png)

## Filtering
To apply a filter, enter a regexp search term in the search bar with the "Filter" mode active. 

![filter name](https://user-images.githubusercontent.com/624531/207634860-7197c4b3-ae82-499a-922e-878cbaa1e0bd.png)

There are several options associated with a filter, which are described below:

- **Edit:** Click the pencil icon next to the filter to edit the filter term.
- **Delete:** Click the X icon to remove a filter.
- **Toggle visibility:** Click the eye icon to hide or show a filter.
- **Toggle case sensitivity:** Insensitive means log lines must match the filter, case insensitive. This means that "error" will match "error", "ERROR", "errOR", et cetera. Sensitive means that log lines must match the filter, case sensitive. This means that "error" will only match "error."
- **Toggle match type:** Exact means log lines must exactly match filter criteria. Inverse means that log lines must not match filter criteria.

Project-level filters in Parsley are configured via Evergreen's project settings. See [here](https://docs.devprod.prod.corp.mongodb.com/evergreen/Project-Configuration/Project-and-Distro-Settings/#parsley-filters) for details.

### Expanding filtered lines

When a filter is applied, unmatching lines are collapsed and are represented by a row that indicates the number of lines skipped. A collapsed row consists of two buttons: one to expand all collapsed lines between filtered lines, and one to expand 5 lines above and 5 below. If there are fewer than five lines to expand, the second button is grayed out. Expanded lines appear in the side panel, and can be re-collapsed by clicking the X icon on the left of each entry. 

![exp row example](https://user-images.githubusercontent.com/624531/207634909-a8419e09-6a47-4e8d-a32a-75fdbd0a0bdc.png)

You can hide the skipped line indicators entirely by toggling the expandable row option off in the details menu. 

![exp rows](https://user-images.githubusercontent.com/624531/207634972-19ac3628-280f-47b8-ab65-8f7ba4d6c545.png)

![exp row off](https://user-images.githubusercontent.com/624531/207634975-d9a240ac-624e-4fbf-81f7-81094f6e5ab9.png)

![exp row on](https://user-images.githubusercontent.com/624531/207634978-d245ca06-5e5b-410b-9b62-4500b7491c54.png)

Multiple filters can be applied at the same time. Each filter’s settings can be managed individually as described in previous sections. 

![two filters](https://user-images.githubusercontent.com/624531/207635077-16f535fc-b968-4467-b6ad-f96b15ba78f9.png)

You can change the filtering logic from AND and OR using the toggle in the details menu. Filtering logic will affect how multiple filters are processed.

![filter logic](https://user-images.githubusercontent.com/624531/207635120-79d1daa5-e637-46e2-bd76-720ea0047e4f.png)
