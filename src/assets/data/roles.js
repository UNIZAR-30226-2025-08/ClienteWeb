export const roles = [
    {
      src: new URL('../roles/aldeano.jpeg', import.meta.url).href,
      nombre: 'Aldeano',
      descripcion: 'No posee ningún poder especial, aparte de su intuición y su sentido común',
      equipo: 'Bando del pueblo'
    },
    {
      src: new URL('../roles/bruja.jpeg', import.meta.url).href,
      nombre: 'Bruja',
      descripcion: 'Posee dos pociones que puede usar por la noche, tras el turno de los hombres lobo: la Poción de la Vida salvará a un personaje del ataque de los Hombres Lobo (también puede reservársela para ella misma) y la Poción de la Muerte matará a otro personaje de su elección. Puede usar una, ninguna o las dos pociones durante el mismo turno si así lo desea, pero una vez ha utilizado una de las pociones, la pierde para el resto de la partida y no podrá volver a servirse de ella.',
      equipo: 'Bando del pueblo'
    },
    {
      src: new URL('../roles/cazador.jpeg', import.meta.url).href,
      nombre: 'Cazador',
      descripcion: 'Cuando muera, puede elegir a otro jugador a quien matar. La decisión es únicamente suya y no se debe tomar por consenso ni consejo.',
      equipo: 'Bando del pueblo'
    },
    {
      src: new URL('../roles/hombre_lobo.jpeg', import.meta.url).href,
      nombre: 'Hombre Lobo',
      descripcion: 'Por la noche, designarán una víctima que será devorada. Debe haber unanimidad en la designación de la víctima o, en caso contrario, no habrá víctima esa noche.',
      equipo: 'Bando de los lobos'
    },
    {
      src: new URL('../roles/vidente.jpeg', import.meta.url).href,
      nombre: 'Vidente',
      descripcion: 'Todas las noches elige un jugador para que el Narrador le revele la carta de personaje correspondiente. El Narrador le muestra a la Vidente, en silencio y en secreto, la carta de dicho jugador.',
      equipo: 'Bando del pueblo'
    },
    {
      src: new URL('../roles/elaguacil.png', import.meta.url).href,
      nombre: 'Aguacil',
      descripcion: 'El Alguacil se elige democráticamente por el pueblo en un momento dado de la partida, a discreción del Narrador. Es un cargo o función, no un personaje. No supone ningún bando, y quien reciba el cargo de Alguacil gana la habilidad de que su voto para linchar valdrá por dos y, en caso de empate en la votación, él decidirá a qué jugador entre los empatados se lincha. Si el Alguacil muere en el transcurso de la partida, él mismo designa un sucesor para recibir el cargo de Alguacil, con su último aliento.',
      equipo: 'No supone ningún bando'
    }
  ];
  