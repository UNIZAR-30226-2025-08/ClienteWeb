export const roles = [
    {
      src: new URL('../roles/aldeano.jpeg', import.meta.url).href,
      nombre: 'Aldeano',
      descripcion: 'No posee ningún poder especial, aparte de su intuición y su sentido común',
      equipo: 'Bando de los aldeanos'
    },
    {
      src: new URL('../roles/bruja.jpeg', import.meta.url).href,
      nombre: 'Bruja',
      descripcion: 'Posee dos pociones que puede usar por la noche, tras el turno de los hombres lobo: la Poción de la Vida salvará a un personaje del ataque de los Hombres Lobo de esa misma noche (también puede reservársela para ella misma) y la Poción de la Muerte matará a otro personaje de su elección. Puede usar una, ninguna o las dos pociones durante el mismo turno si así lo desea, pero una vez ha utilizado una de las pociones, la pierde para el resto de la partida y no podrá volver a servirse de ella.',
      equipo: 'Bando de los aldeanos'
    },
    {
      src: new URL('../roles/cazador.jpeg', import.meta.url).href,
      nombre: 'Cazador',
      descripcion: 'Cuando muera, puede elegir a otro jugador a quien matar. La decisión es únicamente suya y no se debe tomar por consenso ni consejo.',
      equipo: 'Bando de los aldeanos'
    },
    {
      src: new URL('../roles/hombre_lobo.jpeg', import.meta.url).href,
      nombre: 'Hombre Lobo',
      descripcion: 'Por la noche, designarán una víctima que será devorada. Debe haber unanimidad en la designación de la víctima o, en caso contrario, no habrá víctima esa noche.',
      equipo: 'Bando de los hombres lobos'
    },
    {
      src: new URL('../roles/vidente.jpeg', import.meta.url).href,
      nombre: 'Vidente',
      descripcion: 'Todas las noches elige un jugador para revelar su correspondiente carta de personaje y descubrir su rol. La carta de dicho jugador es únicamente mostrada a la vidente.',
      equipo: 'Bando de los aldeanos'
    },
    {
      src: new URL('../roles/elaguacil.png', import.meta.url).href,
      nombre: 'Aguacil',
      descripcion: 'El cargo del Alguacil se elige democráticamente por el pueblo. Es un cargo o función extra, no es un rol de personaje. Un jugador siempre tendrá su rol y la posibilidad de ostentar el cargo del Alguacil. Por tanto, no supone ningún bando, y quien reciba el cargo de Alguacil gana la habilidad de que su voto para linchar a un jugador durante el día valdrá por dos. Si el Alguacil muere en el transcurso de la partida, él mismo designa un sucesor para recibir el cargo de Alguacil.',
      equipo: 'Es un cargo. No supone ningún bando'
    }
  ];
  