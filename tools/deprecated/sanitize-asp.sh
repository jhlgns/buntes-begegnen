# asp-page Tag Helper überprüfen
# TODO: RedirectToPage(...), Page(...) etc.
for x in $(rg -e "asp-page=\"[^@]" | sed -re "s#^.*asp-page=\"([^\"]+)\".*\$#\1#g");
do
    test -f src/BuntesBegegnen.Api/Pages$x.cshtml || echo "Pages$x.cshtml does not exist";
done

# Breadcrumbs überprüfen
page_names=$(find ./src/BuntesBegegnen.Api -iname "*.cshtml" |
    sed -re "s#^\./src/BuntesBegegnen.Api/Pages(.*)\.cshtml\$#\1#g" |
    sed -re "/\/_(.*)/d" |
    sed -re "/\/Shared\/Components/d")

for page in $page_names
do
    page_matches=$(grep --count -e "\[\"$page\"\]\s*" ./src/BuntesBegegnen.Api/Pages/Shared/BreadCrumbs.cs)
    if [[ $page_matches == "0" ]]
    then
        echo "No breadcrumb found for page $page"
    fi
done
