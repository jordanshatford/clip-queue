import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faBars, faForward, faBackward, faPlay, faTrash, faSun } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(faMoon);
library.add(faSun);
library.add(faBars);
library.add(faTimes);
library.add(faForward);
library.add(faBackward);
library.add(faPlay);
library.add(faTrash);
library.add(faGithub);

export default FontAwesomeIcon;
