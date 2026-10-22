import { useEffect, useRef } from "react";
import { incrementarVisualizacao } from "../services/incrementarVisualizacao";

export default function viewObserver(id){
    const ElemRef = useRef(null);
    const jaVisto = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            async ([entry]) => {
              if (entry.isIntersecting && !jaVisto.current) {
                jaVisto.current = true
    
                try {
                    await incrementarVisualizacao({ id })
                } catch (error) {
                    console.error("Erro ao atualizar visualizações:", error)
                }
                observer.disconnect()
              }
            }, {
              threshold: 0.7
            }
          )
    
          if (ElemRef.current) observer.observe(ElemRef.current)
    
          return () => observer.disconnect()
      }, [id])

      return ElemRef;
}