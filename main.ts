import { serve } from "https://deno.land/std/http/server.ts";

// router constructor
function App() {
  const app = {
    routes: {},
    router(method, route, cb) {
      const that = this;
      const res = {
        statusCode: 200,
        message: 'OK',
        status(newStatus) {
          this.statusCode = newStatus
          return this
        },
        send(response) {
          this.message = typeof response === 'object' ? JSON.stringify(response) : response;
        },
        method,
        cb,
      };
      this.routes[route] = res;
    },
    run(port, cb) {
      cb();
      serve((req: Request) => {
        const routes = Object.keys(this.routes);
        const foundRoute = routes.find((route) => {
          const routeUrl = new URLPattern({ pathname: route });
          const routeObj = routeUrl.exec(req.url);
          if (routeObj) {
            // console.log(routeObj)
          }
          return routeObj;
        });
        if (!foundRoute) {
          return new Response('Not Found', {
            port,
            status: 404,
            'content-type': 'application/json'
          });
        }
        const res = this.routes[foundRoute];
        if (req.method !== res.method) {
          return new Response('Invalid Method', {
            port,
            status: 404,
            'content-type': 'application/json'
          });
        }
        res.cb(req, res);
        return new Response(res.message, {
          port,
          status: res.statusCode,
          'content-type': 'application/json'
        });
      });
    }
  }
  return app;
}


const app = App();

// router management
app.router('GET', '/', (req, res) => {
  res.send('Hello world!');
})
app.router('POST', '/indonesia', (req, res) => {
  res.send('Hello Indonesia!');
})
app.router('GET', '/books', (req, res) => {
  res.send([1,2,3,4]);
})

app.run(80, () => {
  console.log('server is running');
})
