import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(faMoon);
library.add(faSun);
library.add(faBars);
library.add(faTimes);
library.add(faGithub);

export default FontAwesomeIcon;
