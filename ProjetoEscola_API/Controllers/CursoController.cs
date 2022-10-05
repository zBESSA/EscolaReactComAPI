using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

namespace ProjetoEscola_API.Controllers{
    [Route("api/[controller]")]
    [ApiController]

    public class CursoController : ControllerBase{
        private EscolaContext _context;

        public CursoController(EscolaContext context){
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Curso>> GetAll(){
            return _context.Curso.ToList();
        }

        [HttpGet("{CursoId}")]
        public ActionResult<List<Curso>> Get(int CursoID){
            try{
                var result = _context.Curso.Find(CursoID);
                if(result == null){
                    return NotFound();
                }
                return Ok(result);
            }
            catch{
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Falha no acesso ao banco de dados.");
            }
        }

        [HttpPost]
        public async Task<ActionResult> post(Curso model){
            try{
                _context.Curso.Add(model);
                if (await _context.SaveChangesAsync() == 1){
                    return Ok();
                }
            }
            catch{
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                "Falha no acesso ao banco de dados.");
            }
            return BadRequest();
        }

        [HttpPut]
        public async Task<ActionResult> put(int CursoId, Curso dadosCursoAlt){
            try{
                var result = await _context.Curso.FindAsync(CursoId);
                if(CursoId != result.id)
                    return BadRequest();

                result.codCurso     = dadosCursoAlt.codCurso;
                result.nomeCurso    = dadosCursoAlt.nomeCurso;
                result.periodo      = dadosCursoAlt.periodo;

                await _context.SaveChangesAsync();
                return Created($"/aí/curso/{dadosCursoAlt.codCurso}", dadosCursoAlt);
            }
            catch{
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso do banco de dados.");  
            }
        }

        [HttpDelete]
        public async Task<ActionResult> delete(int CursoId){
            try{
                //verifica se existe aluno a ser excluído
                var curso = await _context.Curso.FindAsync(CursoId);
                if(curso == null){

                    //método do EF
                    return NotFound();
                }
                _context.Remove(curso);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch{
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }
    }
}
