/**
 * A generated module for Chat functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */
import { dag, Directory, Service, object, func, Container } from "@dagger.io/dagger"

@object()
export class Chat {
  /**
   * Build nodejs image with dependencies inside.
   * This image is build for developer environment only and not should be used in production.
   */
  // @func()
  private buildContainer(source: Directory): Container {
    return dag
      .container()
      .from("node:24.2")
      .withDirectory("/code", source)
      .withWorkdir("/code")
      .withMountedCache("/root/.npm", dag.cacheVolume("node-24.2"))
      .withExec(["npm", "install"])
  }

  /**
   * Transpile project to javascript
   */
  @func('transpile')
  transpile(source: Directory): Container {
    return this
      .buildContainer(source)
      .withExec(["npm", "run", "clean"])
      .withExec(["npm", "run", "build"])
  }

  @func('linter')
  linter(source: Directory): Promise<string> {
    return this
      .buildContainer(source)
      .withExec(["npm", "run", "lint"])
      .stdout()
  }

  /**
   * Run server as service.
   */
  @func('run:server')
  server(source: Directory): Service {
    return this
      .transpile(source)
      .withExposedPort(8080)
      .asService({ args: ["node", "dist/server.js"] })
  }

  /**
   * Run client 
   */
  // @func('run:client')
  // client(source: Directory): Container {
  //   return this
  //     .transpile(source)
  //     .withServiceBinding("localhost", this.server(source))
  //     .withExec(["npm", "run", "client"])
  // }

  /**
  * run unittest in the project
  */
  @func('test')
  async unittest(source: Directory): Promise<string> {
    return this
      .buildContainer(source)
      .withExec(["npm", "run", "test"])
      .stdout()
  }
}
