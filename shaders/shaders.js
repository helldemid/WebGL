const vertexShaderSource = `
    attribute vec3 vertex;
    attribute vec3 normal;
    uniform mat4 matrix;
    uniform mat4 normalMatrix;
    uniform vec3 lightDirection;
    uniform vec3 viewPosition;
    uniform vec3 ambientColor;
    uniform vec3 diffuseColor;
    uniform vec3 specularColor;
    uniform float shininess;

    varying vec3 vColor;  // Передаем цвет, вычисленный в вершине
    varying vec3 vPosition;  // Позиция вершин
    varying vec3 vNormal;  // Нормаль вершин

    void main() {
        vec4 position = matrix * vec4(vertex, 1.0);
        gl_Position = position;
        vPosition = position.xyz;  // Передаем позицию в фрагментный шейдер
        vNormal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);  // Передаем нормаль в фрагментный шейдер

        // Вычисляем освещенность (ambient, diffuse, specular)
        vec3 lightDir = normalize(lightDirection - vPosition);
        vec3 viewDir = normalize(viewPosition - vPosition);

        vec3 ambient = ambientColor;
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 diffuse = diff * diffuseColor;

        vec3 reflectDir = reflect(-lightDir, vNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
        vec3 specular = spec * specularColor;

        vColor = ambient + diffuse + specular;  // Передаем вычисленный цвет в фрагментный шейдер
}

`;

const fragmentShaderSource = `
    precision mediump float;

    varying vec3 vColor;  // Получаем цвет из вершинного шейдера

    void main() {
        gl_FragColor = vec4(vColor, 1.0);  // Применяем полученный цвет к фрагменту
}
`;
