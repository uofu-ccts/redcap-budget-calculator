# Building the Budget Calculator Client

Whether building the Budget Calculator client for use with the REDCap Budget Calculator  module, or including the client in another project, you will need to install several ReactJS components.

Include the Font Awesome components and libraries using the following commands at the root of the project you use to build the Budget Calculator client.

```
# main font awesome libraries
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome

# specific solid icons set that we use
npm i --save @fortawesome/free-solid-svg-icons
```

See the https://github.com/FortAwesome/react-fontawesome website for more detailed instructions. The icons used by the Budget Calculator may be included in a Library object, but for portability across projects, they are imported and used individually in the Budget Calculator.