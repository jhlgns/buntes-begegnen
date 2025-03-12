(
    echo "// NOTE: This file was generated using generate-main-scss.sh.";
    find src/BuntesBegegnen.Api/Pages -iname "*.scss" | sed -re "s#src/BuntesBegegnen.Api/Pages/(.+)\.scss\$#@use \"\1\" as \*;#g"
) > src/BuntesBegegnen.Api/Styles/Main.scss
